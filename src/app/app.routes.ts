import { Routes } from '@angular/router';
import { TrackInfoComponent } from './track-info/track-info.component';
import { HomeComponent } from './home/home.component';
import { MembershipPricingComponent } from './membership-pricing/membership-pricing.component';
import { DailyComponent } from './daily/daily.component';
import { GalleryComponent } from './gallery/gallery.component';
import { EventsComponent } from './event-schedule/events.component';
import { SponsorsComponent } from './sponsors/sponsors.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'track-info', component: TrackInfoComponent },
    { path: 'daily-signup', component: DailyComponent },
    {
        path: 'pricing',
        component: MembershipPricingComponent
    },
    { path: 'gallery', component: GalleryComponent },
    { path: 'schedule', component: EventsComponent },
    { path: 'sponsors', component: SponsorsComponent }
];
