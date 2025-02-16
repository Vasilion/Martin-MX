import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';

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
export class EventsComponent implements OnInit {
    public monthsGrouped: MonthGroup[] = [];
    public scheduleYear: number = new Date().getFullYear();
    public openPractice: any;

    constructor(private apiService: ApiService) {}

    public ngOnInit(): void {
        this.getEvents();
    }

    public getEvents(): void {
        let openPracticeDates: string[] = [];

        this.apiService.getOpenSignUp().subscribe(response => {
            if (!response) {
                return;
            }
            this.openPractice = response.data.attributes;

            if (this.openPractice.Date) {
                openPracticeDates.push(this.openPractice.Date);
            }
            if (this.openPractice.Date2) {
                openPracticeDates.push(this.openPractice.Date2);
            }

            const today = new Date().toISOString().split('T')[0];

            if (typeof this.openPractice.startTime === 'string') {
                const startTime = new Date(
                    `${today}T${this.openPractice.startTime}`
                );
                this.openPractice.startTime = startTime.toLocaleTimeString(
                    undefined,
                    {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    }
                );
            }

            if (typeof this.openPractice.endTime === 'string') {
                const endTime = new Date(
                    `${today}T${this.openPractice.endTime}`
                );
                this.openPractice.endTime = endTime.toLocaleTimeString(
                    undefined,
                    {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    }
                );
            }

            this.apiService.getSchedule().subscribe(data => {
                if (data && data.length > 0) {
                    if (data[0].date) {
                        this.scheduleYear = new Date(
                            data[0].date
                        ).getFullYear();
                    }
                }
                const processedEvents = this.processEvents(
                    data,
                    openPracticeDates
                );
                this.monthsGrouped = this.groupScheduleByMonth(processedEvents);
            });
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

            // Convert event date to YYYY-MM-DD format for comparison
            const eventDateFormatted = new Date(event.date)
                .toISOString()
                .split('T')[0];

            const isOpenPractice = openPracticeDates.some(
                (practiceDate): boolean => {
                    console.log('Comparing:', {
                        eventDate: eventDateFormatted,
                        practiceDate: practiceDate
                    });
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
