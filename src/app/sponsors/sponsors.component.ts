import { CommonModule } from "@angular/common";
import { ApiService } from "../services/api.service";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Sponsor } from "../interfaces/responses";


@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    selector: 'app-sponsors',
    templateUrl: 'sponsors.component.html',
    styleUrls: ['sponsors.component.css'],
})
export class SponsorsComponent {
    public sponsors: Sponsor[] = [];

    constructor(private apiService: ApiService) {
        this.getSponsors();
    }

    private getSponsors(): void {
        this.apiService.getSponsors().subscribe((data: Sponsor[]) => {
            if (!data || data.length === 0) {
                return;
            }

            this.sponsors = data
                .filter((sponsor: Sponsor) => sponsor.isActive)
                .map((data: any): Sponsor => {
                    return {
                        name: data.name,
                        photo: data?.photo?.data[0]?.attributes?.url,
                        link: data.link,
                        isActive: data.isActive,
                    };
                });
        });
    }
}
