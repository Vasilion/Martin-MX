import { Component } from '@angular/core';
import { AboutComponent } from '../about/about.component';
import { BlogComponent } from '../blog-news/blog.component';
import { ContactComponent } from '../contact/contact.component';
import { HeroComponent } from '../hero/hero.component';
import { TracksComponent } from '../tracks/tracks.component';
import { TitleSponsorsComponent } from '../title-sponsors/title-sponsors.component';

@Component({
    standalone: true,
    imports: [
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
    constructor() {}
}
