import { Routes } from '@angular/router';
import { TrackInfoComponent } from './track-info/track-info.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'track-info', component: TrackInfoComponent },
];
