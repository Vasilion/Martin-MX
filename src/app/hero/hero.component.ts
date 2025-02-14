import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [RouterModule, CommonModule],
    selector: 'app-hero',
    templateUrl: 'hero.component.html',
    styleUrls: ['hero.component.css']
})
export class HeroComponent {
    public openPractice: any;

    constructor(private apiServivce: ApiService) {
        this.getPricing();
    }

    private getPricing() {
        this.apiServivce.getOpenSignUp().subscribe((response: any) => {
            if (!response) {
                return;
            }
            const attributes = response.data.attributes;

            let combinedDateTime = null;
            if (attributes.Date && attributes.startTime) {
                const [year, month, day] = attributes.Date?.split('-');
                const [hours, minutes] = attributes.startTime?.split(':');

                combinedDateTime = new Date(
                    year,
                    month - 1,
                    day,
                    hours,
                    minutes
                );
            }

            this.openPractice = {
                ...attributes,
                combinedDateTime
            };
        });
    }
}
