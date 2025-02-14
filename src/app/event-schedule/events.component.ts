import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

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
}

interface MonthGroup {
    name: string;
    events: ProcessedEvent[];
}

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-events',
    templateUrl: 'events.component.html',
    styleUrls: ['events.component.css']
})
export class EventsComponent implements OnInit {
    public monthsGrouped: MonthGroup[] = [];
    public scheduleYear: number = new Date().getFullYear();

    constructor(private apiService: ApiService) {}

    public ngOnInit(): void {
        this.getEvents();
    }

    public getEvents(): void {
        this.apiService.getSchedule().subscribe(data => {
            if (data && data.length > 0) {
                if (data[0].date) {
                    this.scheduleYear = new Date(data[0].date).getFullYear();
                }
            }
            const processedEvents = this.processEvents(data);
            this.monthsGrouped = this.groupScheduleByMonth(processedEvents);
        });
    }

    private processEvents(events: Event[]): ProcessedEvent[] {
        return events.map(event => {
            const baseDate = new Date(event.date);
            let endDate = null;

            if (event.endTime) {
                const [hours, minutes] = event.endTime.split(':');
                endDate = new Date(baseDate);
                endDate.setHours(parseInt(hours), parseInt(minutes), 0);
            }

            return {
                date: baseDate,
                endDate,
                title: event.title,
                isCancelled: event.isCancelled
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
