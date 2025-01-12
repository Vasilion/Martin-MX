import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-track-info',
    templateUrl: 'track-info.component.html',
    styleUrls: ['track-info.component.scss'],
})
export class TrackInfoComponent implements AfterViewInit {
    @ViewChildren('animatedSection') animatedSections!: QueryList<ElementRef>;
    private observer: IntersectionObserver;

    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px'
            }
        );
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.animatedSections.forEach(section => {
                if (section.nativeElement) {
                    section.nativeElement.classList.add('fade-in-section');
                    this.observer.observe(section.nativeElement);
                }
            });
        });
    }

    ngOnDestroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
