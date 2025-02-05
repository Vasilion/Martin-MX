import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
    ApiService,
    CLASSES,
    PracticeSpotsLeft
} from '../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class MembershipPricingGuard implements CanActivate {
    private readonly PRICING_URL = '/pricing';

    constructor(
        private router: Router,
        private apiService: ApiService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        _: RouterStateSnapshot
    ): Observable<boolean> {
        console.log('MembershipPricingGuard activated');
        const classType = route.queryParams['class'];

        if (!classType || !Object.values(CLASSES).includes(classType)) {
            console.error('Invalid class type:', classType);
            this.router.navigate([this.PRICING_URL]);
            return of(true);
        }

        const getSpotsLeft = this.getClassSpotsLeft(classType);

        return getSpotsLeft.pipe(
            switchMap(spotsData => {
                console.log('Spots data:', spotsData);
                if (!spotsData) {
                    console.error(`No data found for class ${classType}`);
                    this.router.navigate([this.PRICING_URL]);
                    return of(true);
                }
                spotsData.spotsLeft -= 1;
                return this.updateClassSpots(classType, spotsData).pipe(
                    map(response => {
                        console.log('Update response:', response);
                        if (response && response.spotsLeft >= 0) {
                            return true;
                        } else {
                            this.router.navigate([this.PRICING_URL]);
                            return true;
                        }
                    })
                );
            }),
            catchError(error => {
                console.error(`Check failed for class ${classType}:`, error);
                this.router.navigate([this.PRICING_URL]);
                return of(true);
            })
        );
    }

    private getClassSpotsLeft(
        classType: string
    ): Observable<PracticeSpotsLeft> {
        console.log('Fetching spots left for class:', classType);
        switch (classType) {
            case CLASSES.AB:
                return this.apiService.getOpenClassABSpotsLeft().pipe(
                    map(data => {
                        console.log('Data:', data);
                        return {
                            class: CLASSES.AB,
                            spotsLeft: data.numberOfSpotsLeft
                        };
                    })
                );
            case CLASSES.C:
                return this.apiService.getOpenClassCSpotsLeft().pipe(
                    map(data => {
                        return {
                            class: CLASSES.C,
                            spotsLeft: data.numberOfSpotsLeft
                        };
                    })
                );

            case CLASSES.Mini:
                return this.apiService.getOpenClassMiniSpotsLeft().pipe(
                    map(data => {
                        return {
                            class: CLASSES.Mini,
                            spotsLeft: data.numberOfSpotsLeft
                        };
                    })
                );

            default:
                throw new Error(`Invalid class type: ${classType}`);
        }
    }

    private updateClassSpots(
        classType: string,
        spotsData: PracticeSpotsLeft
    ): Observable<PracticeSpotsLeft> {
        console.log('Updating spots left for class:', classType);
        console.log('New spots left:', spotsData.spotsLeft);
        switch (classType) {
            case CLASSES.AB:
                return this.apiService.updateOpenClassABSpotsLeft(
                    spotsData.spotsLeft
                );
            case CLASSES.C:
                return this.apiService.updateOpenClassCSpotsLeft(
                    spotsData.spotsLeft
                );
            case CLASSES.Mini:
                return this.apiService.updateOpenClassMiniSpotsLeft(
                    spotsData.spotsLeft
                );
            default:
                throw new Error(`Invalid class type: ${classType}`);
        }
    }
}
