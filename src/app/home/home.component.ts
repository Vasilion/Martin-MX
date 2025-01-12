import { Component } from '@angular/core';
import { AboutComponent } from '../about/about.component';
import { BlogComponent } from '../blog-news/blog.component';
import { ContactComponent } from '../contact/contact.component';
import { HeroComponent } from '../hero/hero.component';
import { TracksComponent } from '../tracks/tracks.component';
import { TitleSponsorsComponent } from '../title-sponsors/title-sponsors.component';
import { ApiService } from '../services/api.service';
import { Sponsor } from '../interfaces/responses';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        HeroComponent,
        ContactComponent,
        BlogComponent,
        AboutComponent,
        TracksComponent,
        TitleSponsorsComponent,
    ],
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
})
export class HomeComponent {
    public isSponsorsVisible: boolean = false;

    constructor(
        private apiService: ApiService
    ) {
        this.apiService.getSponsors().subscribe((data: Sponsor[]) => {
            if (!data || data.length === 0) {
                this.isSponsorsVisible = false;
                return;
            } else {
                const activeSponsors = data
                    .filter((sponsor: Sponsor) => sponsor.isActive && sponsor.isTitle);
                if (activeSponsors.length === 0) {
                    this.isSponsorsVisible = false;
                    return;
                } else {
                    this.isSponsorsVisible = true;
                }
            }
        });
    }
}
