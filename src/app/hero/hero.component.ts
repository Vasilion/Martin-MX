import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { OpenPracticeCacheService } from '../services/open-practice.service';

@Component({
    standalone: true,
    imports: [RouterModule, CommonModule],
    selector: 'app-hero',
    templateUrl: 'hero.component.html',
    styleUrls: ['hero.component.css']
})
export class HeroComponent {
    public openPractice: any;

    constructor(private openPracticeCacheService: OpenPracticeCacheService) {
        this.getPricing();
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
}
