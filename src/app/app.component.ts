import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MobileNavigationComponent } from './mobile-nav/mobile-nav.component';
import { MobileService } from './services/mobile.service';
import { FooterComponent } from './footer/footer.component';
import { TrackInfoComponent } from './track-info/track-info.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        HeaderComponent,
        MobileNavigationComponent,
        FooterComponent,
        TrackInfoComponent,
        HomeComponent,
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
                    this.containerElement?.nativeElement.classList.add(
                        'd-none'
                    );
                } else {
                    this.containerElement?.nativeElement.classList.remove(
                        'd-none'
                    );
                }
            });
    }
}
