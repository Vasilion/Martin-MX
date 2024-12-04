import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MobileNavigationComponent } from './mobile-nav/mobile-nav.component';
import { MobileService } from './services/mobile.service';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        HeaderComponent,
        MobileNavigationComponent,
        FooterComponent,
        CommonModule,
        AsyncPipe
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {

    @ViewChild('container') public containerElement!: ElementRef;
    public isMobile$: Observable<boolean>;

    constructor(private mobileService: MobileService) {
        this.isMobile$ = this.mobileService.showMobileMenu$();
    }

}
