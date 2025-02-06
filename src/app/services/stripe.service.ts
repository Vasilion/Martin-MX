// stripe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
    providedIn: 'root'
})
export class StripeService {
    // TODO
    private stripePromise = loadStripe('');

    constructor(private http: HttpClient) {}

    async redirectToCheckout(formId: string, items: any[]) {
        try {
            // Get Stripe instance
            const stripe = await this.stripePromise;

            // Call your backend to create the Checkout Session
            const response = await this.http
                .post<{ sessionId: string }>('/api/create-checkout-session', {
                    items,
                    formId // This will be used as metadata
                })
                .toPromise();

            // Redirect to Stripe Checkout
            const result = await stripe?.redirectToCheckout({
                sessionId: response?.sessionId
            });

            if (result?.error) {
                console.error(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
