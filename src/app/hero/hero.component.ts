import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OpenPracticeCacheService } from '../services/open-practice.service';
import { WeatherComponent } from '../weather/weather.component';

@Component({
    standalone: true,
    imports: [RouterModule, CommonModule, WeatherComponent],
    selector: 'app-hero',
    templateUrl: 'hero.component.html',
    styleUrls: ['hero.component.css']
})
export class HeroComponent {
    public openPractice: any;
    public showWeather: boolean = false;

    constructor(private openPracticeCacheService: OpenPracticeCacheService) {
        this.getPricing();
    }

    public isDate2Earlier(): boolean {
        if (!this.openPractice?.Date2 || !this.openPractice?.Date) {
            return false;
        }
        return (
            new Date(this.openPractice.Date2) < new Date(this.openPractice.Date)
        );
    }

    private getPricing() {
        this.openPracticeCacheService
            .getOpenPractice()
            .subscribe((response: any) => {
                if (!response) {
                    return;
                }

                this.openPractice = response;
            });
    }

    toggleWeather(): void {
        this.showWeather = !this.showWeather;
    }
}
