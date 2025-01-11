import { CommonModule } from "@angular/common";
import { ApiService } from "../services/api.service";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

interface Sponsor {
    name: string;
    photo?: string;
    link?: string;
    isTitle?: boolean;
}

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    selector: 'app-title-sponsors',
    templateUrl: 'title-sponsors.component.html',
    styleUrls: ['title-sponsors.component.css'],
})
export class TitleSponsorsComponent {
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
            .filter((sponsor: any): boolean => sponsor && sponsor.isTitle)
            .map((sponsor: any): Sponsor => ({
                name: sponsor.name,
                photo: sponsor?.photo?.data[0]?.attributes?.url,
                link: sponsor.link,
            }));
        });
    }
}
