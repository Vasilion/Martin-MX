import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hiring-form',
    templateUrl: './hiring-form.component.html',
    styleUrls: ['./hiring-form.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule]
})
export class HiringFormComponent {
    hiringForm: FormGroup;
    isSubmitting = false;
    submissionError = '';
    submissionSuccess = false;

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.hiringForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phone: ['', Validators.required],
            age: ['', [Validators.required, Validators.min(16)]],
            city: ['', Validators.required],
            customerServiceExperience: ['', Validators.required],
            motocrossIndustryFamiliar: ['', Validators.required],
            rideMotocross: ['', Validators.required],
            operatingProceduresFamiliar: ['', Validators.required],
            desiredPosition: ['', Validators.required],
            availability: ['', Validators.required]
        });
    }

    submit() {
        if (this.hiringForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            this.submissionError = '';
            this.submissionSuccess = false;

            const formData = {
                email: this.hiringForm.get('email')?.value.trim(),
                firstName: this.hiringForm.get('firstName')?.value.trim(),
                lastName: this.hiringForm.get('lastName')?.value.trim(),
                phone: this.hiringForm.get('phone')?.value.trim(),
                age: parseInt(this.hiringForm.get('age')?.value),
                city: this.hiringForm.get('city')?.value.trim(),
                customerServiceExperience: this.hiringForm.get(
                    'customerServiceExperience'
                )?.value,
                motocrossIndustryFamiliar: this.hiringForm.get(
                    'motocrossIndustryFamiliar'
                )?.value,
                rideMotocross: this.hiringForm.get('rideMotocross')?.value,
                operatingProceduresFamiliar: this.hiringForm.get(
                    'operatingProceduresFamiliar'
                )?.value,
                desiredPosition: this.hiringForm.get('desiredPosition')?.value,
                availability: this.hiringForm.get('availability')?.value
            };

            console.log('Sending data:', formData);

            this.http
                .post(environment.strapiBaseUrl + '/hiring/submit', formData)
                .subscribe({
                    next: response => {
                        console.log('Success:', response);
                        this.submissionSuccess = true;
                        this.hiringForm.reset();
                        this.isSubmitting = false;
                    },
                    error: error => {
                        console.error('Error submitting application:', error);
                        if (error.error && error.error.error) {
                            console.error('Detailed error:', error.error.error);
                            this.submissionError =
                                error.error.error.message ||
                                'Failed to submit application. Please try again.';
                        } else {
                            this.submissionError =
                                'Failed to submit application. Please try again.';
                        }
                        this.isSubmitting = false;
                    }
                });
        } else {
            // Log validation errors if any
            Object.keys(this.hiringForm.controls).forEach(key => {
                const control = this.hiringForm.get(key);
                if (control?.errors) {
                    console.log(`Validation error for ${key}:`, control.errors);
                }
            });
        }
    }
}
