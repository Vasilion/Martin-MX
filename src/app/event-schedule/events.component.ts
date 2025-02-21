import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { OpenPracticeCacheService } from '../services/open-practice.service';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';

interface Event {
    date: string;
    title: string;
    isCancelled: boolean;
    endTime: string;
}

interface ProcessedEvent {
    date: Date;
    endDate: Date | null;
    title: string;
    isCancelled: boolean;
    isOpenPractice: boolean;
}

interface MonthGroup {
    name: string;
    events: ProcessedEvent[];
}

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    selector: 'app-events',
    templateUrl: 'events.component.html',
    styleUrls: ['events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private scheduleData$ = new BehaviorSubject<Event[]>([]);
    private openPracticeDates$ = new BehaviorSubject<string[]>([]);

    public monthsGrouped$ = new BehaviorSubject<MonthGroup[]>([]);
    public isScheduleLoading$ = new BehaviorSubject<boolean>(true);
    public scheduleYear: number = new Date().getFullYear();

    constructor(
        private apiService: ApiService,
        private openPracticeCacheService: OpenPracticeCacheService
    ) {}

    ngOnInit(): void {
        this.loadOpenPractice();
        this.loadSchedule();

        combineLatest([this.scheduleData$, this.openPracticeDates$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([schedule, openPracticeDates]) => {
                if (schedule.length > 0) {
                    const processedEvents = this.processEvents(
                        schedule,
                        openPracticeDates
                    );
                    this.monthsGrouped$.next(
                        this.groupScheduleByMonth(processedEvents)
                    );
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadOpenPractice(): void {
        this.openPracticeCacheService
            .getOpenPractice()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: response => {
                    if (!response) return;

                    const dates: string[] = [];
                    if (response.Date) dates.push(response.Date);
                    if (response.Date2) dates.push(response.Date2);

                    this.openPracticeDates$.next(dates);
                },
                error: error => {
                    console.error('Error loading open practice dates:', error);
                    this.openPracticeDates$.next([]);
                }
            });
    }

    private loadSchedule(): void {
        this.apiService
            .getSchedule()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: data => {
                    if (data?.[0]?.date) {
                        this.scheduleYear = new Date(
                            data[0].date
                        ).getFullYear();
                    }
                    this.scheduleData$.next(data);
                    this.isScheduleLoading$.next(false);
                },
                error: error => {
                    console.error('Error loading schedule:', error);
                    this.isScheduleLoading$.next(false);
                    this.scheduleData$.next([]);
                }
            });
    }
    private processEvents(
        events: Event[],
        openPracticeDates: string[]
    ): ProcessedEvent[] {
        return events.map(event => {
            const baseDate = new Date(event.date);
            let endDate = null;

            if (event.endTime) {
                const [hours, minutes] = event.endTime.split(':');
                endDate = new Date(baseDate);
                endDate.setHours(parseInt(hours), parseInt(minutes), 0);
            }

            const eventDateFormatted = new Date(event.date)
                .toISOString()
                .split('T')[0];

            const isOpenPractice = openPracticeDates.some(
                (practiceDate): boolean => {
                    return eventDateFormatted === practiceDate;
                }
            );

            return {
                date: baseDate,
                endDate,
                title: event.title,
                isCancelled: event.isCancelled,
                isOpenPractice
            };
        });
    }

    private groupScheduleByMonth(events: ProcessedEvent[]): MonthGroup[] {
        const sortedEvents = events.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );

        const monthGroups = new Map<string, ProcessedEvent[]>();
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        sortedEvents.forEach(event => {
            const monthName = monthNames[event.date.getMonth()];
            monthGroups.set(monthName, [
                ...(monthGroups.get(monthName) || []),
                event
            ]);
        });

        return monthNames
            .filter(month => monthGroups.has(month))
            .map(month => ({
                name: month,
                events: monthGroups.get(month)
            }));
    }
}
