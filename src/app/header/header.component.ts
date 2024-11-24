import { Component } from '@angular/core';
import { MobileService } from '../services/mobile.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MobileNavigationComponent } from '../mobile-nav/mobile-nav.component';

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
    styleUrls: ['header.component.css'],
})
export class HeaderComponent {

    public showMobileNav: boolean = false;

    constructor(private mobileService: MobileService) {}

    public get isMobile$(): Observable<boolean> {
        return this.mobileService.isHandset();
    }

    public toggleMobileNav(): void {
        this.showMobileNav = !this.showMobileNav;
    }
}
