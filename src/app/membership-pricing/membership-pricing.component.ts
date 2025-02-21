import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StripeService } from '../services/stripe.service';
import { CLASSES, PracticeSpotsLeft } from '../interfaces/responses';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    selector: 'app-membership-pricing',
    templateUrl: 'membership-pricing.component.html',
    styleUrls: ['membership-pricing.component.css']
})
export class MembershipPricingComponent {
    /*
     * YOU TALKIN' BOUT PRACTICE??
     */
    public signUpForm: FormGroup;
    public openPractice: any;
    public yearlySignUp: any;
    public showForm: boolean = false;
    public payLink: string;
    private classes: PracticeSpotsLeft[] = [];

    constructor(
        private apiServivce: ApiService,
        private stripeService: StripeService,
        private fb: FormBuilder
    ) {
        this.getPricing();
        this.getSpotsLeft();
        this.signUpForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            riderName: ['', Validators.required],
            bikeSize: ['', [Validators.required]],
            riderNumber: ['', Validators.required],
            dropdown: ['', Validators.required]
        });
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

    public get spotsLeftClassJr(): number {
        return this.classes?.find(c => c.class === CLASSES.JR.name)?.spotsLeft;
    }

    public submit(): void {
        if (this.signUpForm.valid) {
            this.determinePayLink(this.signUpForm.get('dropdown').value);

            const formFields = [
                'email',
                'riderName',
                'bikeSize',
                'riderNumber',
                'dropdown'
            ];
            formFields.forEach(field => {
                localStorage.setItem(field, this.signUpForm.get(field).value);
            });

            window.open(this.payLink, '_blank');
            this.signUpForm.reset();
        } else {
            const errors = [];

            Object.keys(this.signUpForm.controls).forEach(key => {
                const control = this.signUpForm.get(key);
                if (control.errors) {
                    switch (key) {
                        case 'email':
                            if (control.errors['required']) {
                                errors.push('Email is required');
                            } else if (control.errors['email']) {
                                errors.push(
                                    'Please enter a valid email address'
                                );
                            }
                            break;
                        case 'riderName':
                            if (control.errors['required']) {
                                errors.push('Rider name is required');
                            }
                            break;
                        case 'bikeSize':
                            if (control.errors['required']) {
                                errors.push('Bike size is required');
                            }
                            break;
                        case 'riderNumber':
                            if (control.errors['required']) {
                                errors.push('Rider number is required');
                            } else if (control.errors['pattern']) {
                                errors.push(
                                    'Rider number must be a valid number'
                                );
                            }
                            break;
                        case 'dropdown':
                            if (control.errors['required']) {
                                errors.push(
                                    'Please select an option from the dropdown'
                                );
                            }
                            break;
                        default:
                            if (control.errors['required']) {
                                errors.push(`${key} is required`);
                            }
                    }
                }
            });

            if (errors.length > 0) {
                const errorMessage =
                    'Please correct the following errors:\n\n' +
                    errors.map(error => '• ' + error).join('\n');
                alert(errorMessage);
            }
        }
    }

    public determinePayLink(classString: string): void {
        if (classString.includes('A/B')) {
            this.payLink = CLASSES.AB.formLink;
        }
        if (classString.includes('C')) {
            this.payLink = CLASSES.C.formLink;
        }
        if (classString.includes('Mini')) {
            this.payLink = CLASSES.MINI.formLink;
        }
        if (classString.includes('Jr')) {
            this.payLink = CLASSES.JR.formLink;
        }
    }

    public redirectToCheckoutC() {
        this.stripeService.redirectToForm(CLASSES.C.name);
    }

    public redirectToCheckoutMini() {
        this.stripeService.redirectToForm(CLASSES.MINI.name);
    }

    public redirectToCheckoutAB() {
        this.stripeService.redirectToForm('AB');
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
            if (this.openPractice.isActive) {
                this.showForm = true;
            }
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
