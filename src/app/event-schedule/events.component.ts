import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-events',
    templateUrl: 'events.component.html',
    styleUrls: ['events.component.css'],
})
export class EventsComponent implements OnInit {
    public eventsResponse = [];
    constructor(private apiService: ApiService) {}

    public ngOnInit(): void {

        this.getEvents();
    }

    public getEvents(): void {
        this.apiService
            .getEvents()
            .subscribe((data) => {
                this.eventsResponse = data;
            });
    }
}
