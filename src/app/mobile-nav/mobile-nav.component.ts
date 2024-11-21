import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    imports: [CommonModule],
    standalone: true,
    selector: 'app-mobile-nav',
    templateUrl: 'mobile-nav.component.html',
    styleUrls: ['mobile-nav.component.css'],
})
export class MobileNavigationComponent {

    @ViewChild('mobileLinks') public mobileLinks!: ElementRef;
    public showMobileNav: boolean = false;

    constructor() {}

    public toggleMobileNav(): void {
        this.showMobileNav = !this.showMobileNav;
        this.mobileLinks.nativeElement.classList.toggle('show');
    }
}
