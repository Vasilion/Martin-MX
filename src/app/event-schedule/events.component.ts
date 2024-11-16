import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Event {
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    image: string;
}

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-events',
    templateUrl: 'events.component.html',
    styleUrls: ['events.component.css'],
})
export class EventsComponent {
    public events: Event[] = [
        {
            name: 'Event 1',
            startDate: '2021-01-01T00:00:00',
            endDate: '2021-01-01T23:59:59',
            description: 'This is the first event.',
            image: '/images/old-site/3.jpg',
        },
        {
            name: 'Event 2',
            startDate: '2021-02-01T00:00:00',
            endDate: '2021-02-01T23:59:59',
            description: 'This is the second event.',
            image: '/images/old-site/2.jpg',
        },
    ];
    constructor() {}
}
