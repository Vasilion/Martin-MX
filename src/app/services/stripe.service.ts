import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CLASSES, ClassType } from '../interfaces/responses';

@Injectable({
    providedIn: 'root'
})
export class StripeService {
    constructor(private http: HttpClient) {}

    redirectToForm(classType: ClassType) {
        const config = CLASSES[classType];
        window.location.href = config.formLink;
    }

    async updateSpotAvailability(classType: ClassType) {
        try {
            const config = CLASSES[classType];
            await firstValueFrom(this.http.post(config.strapiEndpoint, {}));
        } catch (error) {
            console.error('Failed to update spot availability:', error);
            throw error;
        }
    }
}
