import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Sponsor } from '../interfaces/responses';

@Component({
    imports: [CommonModule, RouterModule],
    standalone: true,
    selector: 'app-mobile-nav',
    templateUrl: 'mobile-nav.component.html',
    styleUrls: ['mobile-nav.component.css'],
})
export class MobileNavigationComponent {

    @ViewChild('mobileLinks') public mobileLinks!: ElementRef;
    public showMobileNav: boolean = false;
    public isSponsorsVisible: boolean = false;

    constructor(
        private apiService: ApiService
    ) {
        this.apiService.getSponsors().subscribe((data: Sponsor[]) => {
            if (!data || data.length === 0) {
                this.isSponsorsVisible = false;
                return;
            } else {
                const activeSponsors = data.filter((sponsor: Sponsor) => sponsor.isActive);
                if (activeSponsors.length === 0) {
                    this.isSponsorsVisible = false;
                    return;
                } else {
                    this.isSponsorsVisible = true;
                }
            }

        });
    }

    public toggleMobileNav(): void {
        this.showMobileNav = !this.showMobileNav;
        this.mobileLinks.nativeElement.classList.toggle('show');
    }
}
