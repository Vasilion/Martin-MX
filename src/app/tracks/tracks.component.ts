import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
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
    public selectedImage: any;

    constructor(private service: ApiService) {
        this.service.getMainTrackPhotos().subscribe((data) => {
            this.mainTrackPictures = data;
        });
        this.service.getYouthTrackPhotos().subscribe((data) => {
            this.youthTrackPictures = data;
        });
    }

    @HostListener('document:keydown', ['$event'])
    public handleKeyDown(event: KeyboardEvent) {
        // Check if the pressed key is 'Escape' or 'Esc'
        if (event.key === 'Escape' || event.key === 'Esc') {
            this.closeImage();
        }
    }

    public selectImage(image: any) {
        this.selectedImage = image;
    }

    public closeImage() {
        this.selectedImage = null;
    }


}
