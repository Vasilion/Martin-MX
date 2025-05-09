import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OpenPracticeCacheService } from '../services/open-practice.service';
import { BehaviorSubject, Subject, combineLatest, takeUntil } from 'rxjs';

interface ApiResponse {
    id: number;
    date: string;
    title: string | null;
    isCancelled: boolean | null;
    endTime: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

interface Event {
    date: string;
    title: string;
    isCancelled: boolean;
    endTime: string;
}

interface ProcessedEvent {
    date: Date;
    endTime: string;
    title: string;
    isCancelled: boolean;
    isOpenPractice: boolean;
}

interface CalendarDay {
    date: Date;
    events: ProcessedEvent[];
    isToday: boolean;
    isCurrentMonth: boolean;
}

interface CalendarMonth {
    name: string;
    year: number;
    weeks: CalendarDay[][];
}

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    selector: 'app-events',
    templateUrl: 'events.component.html',
    styleUrls: ['events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
    private touchStartX: number = 0;
    private touchEndX: number = 0;
    private destroy$ = new Subject<void>();
    private scheduleData$ = new BehaviorSubject<Event[]>([]);
    private openPracticeDates$ = new BehaviorSubject<string[]>([]);

    public calendarMonths$ = new BehaviorSubject<CalendarMonth[]>([]);
    public currentMonth$ = new BehaviorSubject<CalendarMonth | null>(null);
    public isScheduleLoading$ = new BehaviorSubject<boolean>(true);
    public scheduleYear: number = new Date().getFullYear();
    public currentMonthIndex = new Date().getMonth();
    public currentYear = new Date().getFullYear();
    public selectedDay: CalendarDay | null = null;
    public isMobileView: boolean = false;

    public monthNames = [
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

    public weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    constructor(
        private apiService: ApiService,
        private openPracticeCacheService: OpenPracticeCacheService
    ) {
        this.checkViewport();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.checkViewport();
    }

    private checkViewport() {
        this.isMobileView = window.innerWidth <= 768;
    }

    ngOnInit(): void {
        this.setupSwipeNavigation();
        this.loadOpenPractice();
        this.loadSchedule();

        combineLatest([this.scheduleData$, this.openPracticeDates$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([schedule, openPracticeDates]) => {
                const processedEvents = this.processEvents(
                    schedule,
                    openPracticeDates
                );
                const calendarMonths =
                    this.generateCalendarMonths(processedEvents);
                this.calendarMonths$.next(calendarMonths);
                this.setCurrentMonth();
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
                next: (data: ApiResponse[]) => {
                    if (data?.[0]?.date) {
                        this.scheduleYear = new Date(
                            data[0].date
                        ).getFullYear();
                        this.currentYear = this.scheduleYear;
                    }

                    const transformedData: Event[] = data.map(item => ({
                        date: item.date,
                        title: item.title,
                        isCancelled: item.isCancelled,
                        endTime: item.endTime
                    }));

                    this.scheduleData$.next(transformedData);
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
            const originalDate = new Date(event.date);

            const year = originalDate.getFullYear();
            const month = originalDate.getMonth() + 1;
            const day = originalDate.getDate();
            const dateFormatted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const isOpenPractice = openPracticeDates.some(
                practiceDate => dateFormatted === practiceDate
            );

            return {
                date: originalDate,
                endTime: event.endTime || null,
                title: event.title || null,
                isCancelled: event.isCancelled || false,
                isOpenPractice
            };
        });
    }

    private generateCalendarMonths(events: ProcessedEvent[]): CalendarMonth[] {
        const today = new Date();
        const calendarMonths: CalendarMonth[] = [];

        for (let month = 0; month < 12; month++) {
            const firstDayOfMonth = new Date(this.scheduleYear, month, 1);
            const lastDayOfMonth = new Date(this.scheduleYear, month + 1, 0);

            const firstDayOfCalendar = new Date(firstDayOfMonth);
            firstDayOfCalendar.setDate(
                firstDayOfMonth.getDate() - firstDayOfMonth.getDay()
            );

            const lastDayOfCalendar = new Date(lastDayOfMonth);
            const daysToAdd = 6 - lastDayOfMonth.getDay();
            lastDayOfCalendar.setDate(lastDayOfMonth.getDate() + daysToAdd);

            const weeks: CalendarDay[][] = [];
            let week: CalendarDay[] = [];
            let currentDate = new Date(firstDayOfCalendar);

            while (currentDate <= lastDayOfCalendar) {
                const currentDateCopy = new Date(currentDate);
                const dayEvents = events.filter(event => {
                    const eventDay = event.date.getDate();
                    const eventMonth = event.date.getMonth();
                    const eventYear = event.date.getFullYear();

                    const calendarDay = currentDateCopy.getDate();
                    const calendarMonth = currentDateCopy.getMonth();
                    const calendarYear = currentDateCopy.getFullYear();

                    return (
                        eventDay === calendarDay &&
                        eventMonth === calendarMonth &&
                        eventYear === calendarYear
                    );
                });
                const calendarDay: CalendarDay = {
                    date: currentDateCopy,
                    events: dayEvents,
                    isToday: this.isSameDay(currentDateCopy, today),
                    isCurrentMonth: currentDateCopy.getMonth() === month
                };

                week.push(calendarDay);

                if (week.length === 7) {
                    weeks.push(week);
                    week = [];
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (week.length > 0) {
                weeks.push(week);
            }

            calendarMonths.push({
                name: this.monthNames[month],
                year: this.scheduleYear,
                weeks
            });
        }

        return calendarMonths;
    }

    public hasCancelledEvent(day: CalendarDay): boolean {
        return day.events.some(event => event.isCancelled);
    }

    public formatEndTime(endTime: string): string {
        if (!endTime) return '';
        const [hours, minutes] = endTime.split(':');
        const tempDate = new Date();
        tempDate.setHours(parseInt(hours, 10));
        tempDate.setMinutes(parseInt(minutes, 10));

        return tempDate.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    public isSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    }

    private setCurrentMonth(): void {
        const months = this.calendarMonths$.value;
        if (months.length > 0) {
            const currentMonthIndex = Math.min(this.currentMonthIndex, 11);
            this.currentMonth$.next(months[currentMonthIndex]);
        }
    }

    public prevMonth(): void {
        if (this.currentMonthIndex > 0) {
            this.currentMonthIndex--;
            this.setCurrentMonth();
        } else if (this.currentYear > this.scheduleYear - 1) {
            this.currentYear--;
            this.currentMonthIndex = 11;
            this.loadYearData(this.currentYear);
        }
    }

    public nextMonth(): void {
        this.selectedDay = null;
        if (this.currentMonthIndex < 11) {
            this.currentMonthIndex++;
            this.setCurrentMonth();
        } else if (this.currentYear < this.scheduleYear + 1) {
            this.currentYear++;
            this.currentMonthIndex = 0;
            this.loadYearData(this.currentYear);
        }
    }

    private loadYearData(year: number): void {
        this.scheduleYear = year;
        this.isScheduleLoading$.next(true);
        this.loadSchedule();
    }

    public formatTime(date: Date): string {
        return date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    public goToToday(): void {
        const today = new Date();
        this.currentMonthIndex = today.getMonth();
        this.currentYear = today.getFullYear();
        if (this.currentYear !== this.scheduleYear) {
            this.loadYearData(this.currentYear);
        } else {
            this.setCurrentMonth();
        }
        this.selectToday();
    }

    public selectToday(): void {
        const today = new Date();
        const currentMonth = this.currentMonth$.value;

        if (currentMonth) {
            for (const week of currentMonth.weeks) {
                for (const day of week) {
                    if (this.isSameDay(day.date, today)) {
                        this.selectDay(day);
                        return;
                    }
                }
            }
        }
    }

    public selectDay(day: CalendarDay): void {
        if (!day.isCurrentMonth) {
            return;
        }
        this.selectedDay = day;
    }

    private setupSwipeNavigation(): void {
        document.addEventListener('DOMContentLoaded', () => {
            const calendar = document.querySelector('.mobile-calendar');
            if (calendar) {
                calendar.addEventListener(
                    'touchstart',
                    (e: TouchEvent) => {
                        this.touchStartX = e.changedTouches[0].screenX;
                    },
                    { passive: true }
                );

                calendar.addEventListener(
                    'touchend',
                    (e: TouchEvent) => {
                        this.touchEndX = e.changedTouches[0].screenX;
                        this.handleSwipe();
                    },
                    { passive: true }
                );
            }
        });
    }

    private handleSwipe(): void {
        const threshold = 50;
        if (this.touchEndX + threshold < this.touchStartX) {
            this.nextMonth();
        } else if (this.touchEndX > this.touchStartX + threshold) {
            this.prevMonth();
        }
    }

    public hasOpenPractice(day: CalendarDay): boolean {
        return day.events.some(
            event => event.isOpenPractice && !event.isCancelled
        );
    }
}
