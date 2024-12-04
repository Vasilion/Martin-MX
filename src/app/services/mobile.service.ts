import {
    BreakpointObserver,
    Breakpoints,
    BreakpointState,
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MobileService {
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

    public showMobileMenu$(): Observable<boolean> {
        return this.breakpointObserver.observe('(max-width: 992px')
            .pipe(map((result: BreakpointState): boolean => result.matches));
    }
}
