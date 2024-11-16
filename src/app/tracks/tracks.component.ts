import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ScrollPicture {
    src: string;
}
@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-tracks',
    templateUrl: 'tracks.component.html',
    styleUrls: ['tracks.component.css'],
})
export class TracksComponent {
    public mainTrackPictures: ScrollPicture[] = [
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
    ];
    public youthTrackPictures: ScrollPicture[] = [
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
        { src: '/images/old-site/3.jpg' },
    ];
    constructor() {}
}
