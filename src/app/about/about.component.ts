import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-about',
    templateUrl: 'about.component.html',
    styleUrls: ['about.component.css'],
})
export class AboutComponent {
    constructor() {
        // this.getAbout();
    }

    // private getAbout(): void {
    //     this.service.getAbout().subscribe((data) => {
    //         console.log(data);
    //     });
    // }
}
