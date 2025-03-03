import { Component } from '@angular/core';
import { MobileService } from '../services/mobile.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MobileNavigationComponent } from '../mobile-nav/mobile-nav.component';
import { ApiService } from '../services/api.service';
import { Sponsor } from '../interfaces/responses';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        CommonModule,
        MobileNavigationComponent
    ],
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent {
    public showMobileNav: boolean = false;
    public isSponsorsVisible: boolean = false;

    constructor(
        private mobileService: MobileService,
        private apiService: ApiService
    ) {
        this.apiService.getSponsors().subscribe((data: Sponsor[]) => {
            if (!data || data.length === 0) {
                this.isSponsorsVisible = false;
                return;
            } else {
                const activeSponsors = data.filter(
                    (sponsor: Sponsor) => sponsor.isActive
                );
                if (activeSponsors.length === 0) {
                    this.isSponsorsVisible = false;
                    return;
                } else {
                    this.isSponsorsVisible = true;
                }
            }
        });
    }

    public get isMobile(): boolean {
        return this.mobileService.isMobile();
    }

    public toggleMobileNav(): void {
        this.showMobileNav = !this.showMobileNav;
    }
}
