import { Component, HostListener } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-gallery',
    templateUrl: 'gallery.component.html',
    styleUrls: ['gallery.component.css']
})
export class GalleryComponent {
    public images: any;
    public selectedImage: any;
    constructor(private apiService: ApiService) {
        this.getImages();
    }
    @HostListener('document:keydown', ['$event'])
    public handleKeyDown(event: KeyboardEvent) {
        // Check if the pressed key is 'Escape' or 'Esc'
        if (event.key === 'Escape' || event.key === 'Esc') {
            this.closeImage();
        }
    }

    private getImages() {
        this.apiService.getGallery().subscribe((data: any) => {
            if (!data || data.length === 0) {
                return;
            }
            this.images = data[0].images.data.map(
                (data: any) => data.attributes
            );
        });
    }

    public selectImage(image: any) {
        this.selectedImage = image;
    }

    public closeImage() {
        this.selectedImage = null;
    }
}
