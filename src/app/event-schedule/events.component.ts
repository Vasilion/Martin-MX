import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

interface Event {
    date: Date;
    title: string;
    isCancelled: boolean;
}

interface MonthGroup {
    name: string;
    events: Event[];
}

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-events',
    templateUrl: 'events.component.html',
    styleUrls: ['events.component.css'],
})
export class EventsComponent implements OnInit {

    /*
    This component displays a list of events grouped by month.
    The events are fetched from the API and grouped by month.
    The events are sorted by date.
    The month names are hardcoded in the monthNames array.
    The groupScheduleByMonth method groups the events by month.
    The year of the schedule is determined by the date of the first event.

    the cms user will have to manage these events and at the end of the year
    remove the old events or change their years to the new year.
    * */


    public monthsGrouped: MonthGroup[] = [];
    public scheduleYear: number = new Date().getFullYear();

    constructor(private apiService: ApiService) {}

    public ngOnInit(): void {

        this.getEvents();
    }

    public getEvents(): void {
        this.apiService
        .getSchedule()
        .subscribe((data) => {
            if (data && data.length > 0) {
                if (data[0].date) {
                    this.scheduleYear = new Date(data[0].date).getFullYear();
                }
            }
            this.monthsGrouped = this.groupScheduleByMonth(data);
        });
    }


    private groupScheduleByMonth(events: Event[]): MonthGroup[] {
        const sortedEvents = events.sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            return aDate.getTime() - bDate.getTime();
        });
        const monthGroups = new Map<string, Event[]>();
        const monthNames = ['January', 'February',
            'March', 'April', 'May',
            'June', 'July', 'August', 'September',
            'October', 'November', 'December'];

        sortedEvents.forEach(event => {
            const monthName = monthNames[new Date(event.date).getMonth()];
            monthGroups.set(monthName, [...(monthGroups.get(monthName) || []), event]);
        });

        return monthNames
        .filter(month => monthGroups.has(month))
        .map(month => ({
            name: month,
            events: monthGroups.get(month)
        }));
    }
}
