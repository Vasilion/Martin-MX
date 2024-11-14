import {
    BreakpointObserver,
    Breakpoints,
    BreakpointState,
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MobileService {
    public isMobileMenuActive$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    /*
    Luke is a little slut 
    */
    constructor(private breakpointObserver: BreakpointObserver) {}

    public isHandset(): Observable<boolean> {
        return this.breakpointObserver
            .observe([Breakpoints.Handset])
            .pipe(map((result: BreakpointState): boolean => result.matches));
    }

    public isMobile(): boolean {
        return this.breakpointObserver.isMatched('(max-width: 768px)');
    }
}
