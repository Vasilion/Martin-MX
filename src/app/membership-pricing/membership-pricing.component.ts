import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StripeService } from '../services/stripe.service';
import { CLASSES, PracticeSpotsLeft } from '../interfaces/responses';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    selector: 'app-membership-pricing',
    templateUrl: 'membership-pricing.component.html',
    styleUrls: ['membership-pricing.component.css']
})
export class MembershipPricingComponent {
    /*
     * YOU TALKIN' BOUT PRACTICE??
     */
    public openPractice: any;
    public yearlySignUp: any;
    //public yearlyMembershipStripeLink =
    //    'https://buy.stripe.com/7sI0081086Xr4so4gh';
    //public openPracticeStripeLink = 'https://buy.stripe.com/6oEcMUgZ6chLe2Y288';

    private classes: PracticeSpotsLeft[] = [];

    constructor(
        private apiServivce: ApiService,
        private stripeService: StripeService
    ) {
        this.getPricing();
        this.getSpotsLeft();
    }

    public get spotsLeftClassAB(): number {
        return this.classes?.find(c => c.class === CLASSES.AB.name)?.spotsLeft;
    }

    public get spotsLeftClassC(): number {
        return this.classes?.find(c => c.class === CLASSES.C.name)?.spotsLeft;
    }

    public get spotsLeftClassMini(): number {
        return this.classes?.find(c => c.class === CLASSES.MINI.name)
            ?.spotsLeft;
    }

    public redirectToCheckoutAB() {
        this.stripeService.redirectToForm(CLASSES.AB.name);
    }

    private getSpotsLeft() {
        this.apiServivce
            .getOpenClassABSpotsLeft()
            .subscribe((response: any) => {
                if (!response) {
                    return;
                }
                this.classes.push({
                    class: CLASSES.AB.name,
                    spotsLeft: response.numberOfSpotsLeft
                });
            });

        this.apiServivce.getOpenClassCSpotsLeft().subscribe((response: any) => {
            if (!response) {
                return;
            }
            this.classes.push({
                class: CLASSES.C.name,
                spotsLeft: response.numberOfSpotsLeft
            });
        });

        this.apiServivce
            .getOpenClassMiniSpotsLeft()
            .subscribe((response: any) => {
                if (!response) {
                    return;
                }
                this.classes.push({
                    class: CLASSES.MINI.name,
                    spotsLeft: response.numberOfSpotsLeft
                });
            });
    }

    private getPricing() {
        this.apiServivce.getOpenSignUp().subscribe((response: any) => {
            if (!response) {
                return;
            }
            this.openPractice = response.data.attributes;
            const today = new Date().toISOString().split('T')[0]; // Get today's date

            if (typeof this.openPractice.startTime === 'string') {
                const startTime = new Date(
                    `${today}T${this.openPractice.startTime}`
                );
                this.openPractice.startTime = startTime.toLocaleTimeString(
                    undefined,
                    {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    }
                );
            }

            if (typeof this.openPractice.endTime === 'string') {
                const endTime = new Date(
                    `${today}T${this.openPractice.endTime}`
                );
                this.openPractice.endTime = endTime.toLocaleTimeString(
                    undefined,
                    {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    }
                );
            }
        });
        this.apiServivce.getUnlimitedSignUp().subscribe((response: any) => {
            if (!response) {
                return;
            }
            this.yearlySignUp = response.data.attributes;
        });
    }
}
