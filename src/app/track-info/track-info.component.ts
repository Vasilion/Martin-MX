import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    Renderer2,
} from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-track-info',
    templateUrl: 'track-info.component.html',
    styleUrls: ['track-info.component.css'],
})
export class TrackInfoComponent implements OnInit {
    private overlayElement!: HTMLElement;

    constructor(private renderer: Renderer2, private el: ElementRef) {}

    public ngOnInit(): void {
        this.overlayElement = this.renderer.createElement('div');
        this.renderer.appendChild(
            this.el.nativeElement.querySelector('.parallax-container'),
            this.overlayElement
        );

        this.renderer.setStyle(this.overlayElement, 'position', 'absolute');
        this.renderer.setStyle(this.overlayElement, 'top', '0');
        this.renderer.setStyle(this.overlayElement, 'left', '0');
        this.renderer.setStyle(this.overlayElement, 'width', '100%');
        this.renderer.setStyle(this.overlayElement, 'height', '100%');
        this.renderer.setStyle(
            this.overlayElement,
            'background',
            'rgba(0, 0, 0, 0)'
        );
        this.renderer.setStyle(this.overlayElement, 'pointer-events', 'none');
        this.renderer.setStyle(
            this.overlayElement,
            'transition',
            'background 0.1s ease-out'
        );
    }

    @HostListener('window:scroll', [])
    public onWindowScroll(): void {
        const parallaxElement =
            this.el.nativeElement.querySelector('.parallax-image');
        if (parallaxElement) {
            const scrollPosition = window.pageYOffset;

            this.renderer.setStyle(
                parallaxElement,
                'transform',
                `translateY(${scrollPosition * 0.2}px)`
            );

            const maxDarkness = 0.95;
            const calculatedOpacity = Math.min(
                scrollPosition / 1000,
                maxDarkness
            );
            this.renderer.setStyle(
                this.overlayElement,
                'background',
                `rgba(0, 0, 0, ${calculatedOpacity})`
            );

            this.renderer.setStyle(
                this.overlayElement,
                'transform',
                `translateY(${scrollPosition * 0.2}px)`
            );
        }
    }
}
