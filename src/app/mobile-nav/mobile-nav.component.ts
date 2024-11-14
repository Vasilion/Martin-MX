import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MobileService } from '../services/mobile.service';

@Component({
    imports: [CommonModule],
    standalone: true,
    selector: 'app-mobile-nav',
    templateUrl: 'mobile-nav.component.html',
    styleUrls: ['mobile-nav.component.css'],
})
export class MobileNavigationComponent {
    constructor(private mobileService: MobileService) {}

    public toggleMenu(): void {
        const isActive: boolean =
            this.mobileService.isMobileMenuActive$.getValue();
        this.mobileService.isMobileMenuActive$.next(!isActive);
    }
}
