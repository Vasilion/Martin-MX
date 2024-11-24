import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-tracks',
    templateUrl: 'tracks.component.html',
    styleUrls: ['tracks.component.css'],
})
export class TracksComponent {
    public mainTrackPictures: any[] = [];
    public youthTrackPictures: any[] = [];
    constructor(private service: ApiService) {
        this.service.getMainTrackPhotos().subscribe((data) => {
            this.mainTrackPictures = data;
        });
        this.service.getYouthTrackPhotos().subscribe((data) => {
            this.youthTrackPictures = data;
        });
    }


}
