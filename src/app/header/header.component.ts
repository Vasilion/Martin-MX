import { Component } from '@angular/core';
import { MobileService } from '../services/mobile.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        CommonModule,
    ],
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
})
export class HeaderComponent {
    constructor(private mobileService: MobileService) {}

    public get isMobile$(): Observable<boolean> {
        return this.mobileService.isHandset();
    }
}
