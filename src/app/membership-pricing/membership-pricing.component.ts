import { CommonModule } from "@angular/common";
import { ApiService } from "../services/api.service";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";


@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    selector: 'app-events',
    templateUrl: 'membership-pricing.component.html',
    styleUrls: ['membership-pricing.component.css'],
})
export class MembershipPricingComponent {
    /*
     * YOU TALKING ABOUT PRACTICE??
    * */
    public openPractice: any;
    public yearlySignUp: any;

  constructor(private  apiServivce: ApiService) {

      this.getPricing();
  }

  private getPricing() {
    this.apiServivce.getOpenSignUp().subscribe((response: any) => {
        if (!response) {
            return;
        }
        this.openPractice = response.data.attributes;
    });
    this.apiServivce.getYearlySignUp().subscribe((response: any) => {
        if (!response) {
            return;
        }
        this.yearlySignUp = response.data.attributes;
    });
  }

}
