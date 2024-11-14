import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HeroComponent } from './hero/hero.component';
import { MobileNavigationComponent } from './mobile-nav/mobile-nav.component';
import { MobileService } from './services/mobile.service';
import { ContactComponent } from './contact/contact.component';
import { EventsComponent } from './event-schedule/events.component';
import { BlogComponent } from './blog-news/blog.component';
import { AboutComponent } from './about/about.component';
import { FooterComponent } from './footer/footer.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        HeaderComponent,
        HeroComponent,
        MobileNavigationComponent,
        ContactComponent,
        EventsComponent,
        BlogComponent,
        AboutComponent,
        FooterComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    @ViewChild('container') public containerElement!: ElementRef;
    public isMobileMenuActive: boolean = false;

    constructor(private mobileService: MobileService) {
        this.listenToIsMobileNavigationActive();
    }

    private listenToIsMobileNavigationActive(): void {
        this.mobileService.isMobileMenuActive$
            .pipe()
            .subscribe((isActive: boolean): void => {
                if (isActive) {
                    this.containerElement.nativeElement.classList.add('d-none');
                } else {
                    this.containerElement.nativeElement.classList.remove(
                        'd-none'
                    );
                }
            });
    }
}
