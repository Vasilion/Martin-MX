import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap, shareReplay } from 'rxjs/operators';
import { OpenPractice } from '../interfaces/responses';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OpenPracticeCacheService {
    private readonly CACHE_KEY = 'openPracticeData';
    private readonly TIMESTAMP_KEY = 'openPracticeTimestamp';
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    private openPracticeSubject = new BehaviorSubject<OpenPractice | null>(
        null
    );

    constructor(private http: HttpClient) {
        this.loadFromSessionStorage();
    }

    private loadFromSessionStorage(): void {
        const cachedData = sessionStorage.getItem(this.CACHE_KEY);
        const timestamp = sessionStorage.getItem(this.TIMESTAMP_KEY);

        if (cachedData && timestamp) {
            const parsedData = JSON.parse(cachedData);
            const parsedTimestamp = parseInt(timestamp, 10);

            // Check if the cache is still valid (less than 5 minutes old)
            if (Date.now() - parsedTimestamp <= this.CACHE_DURATION) {
                if (parsedData.combinedDateTime) {
                    parsedData.combinedDateTime = new Date(
                        parsedData.combinedDateTime
                    );
                }
                if (parsedData.combinedDateTime2) {
                    parsedData.combinedDateTime2 = new Date(
                        parsedData.combinedDateTime2
                    );
                }
                this.openPracticeSubject.next(parsedData);
            } else {
                this.clearCache();
            }
        }
    }

    private saveToSessionStorage(data: OpenPractice): void {
        sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
        sessionStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
    }

    private formatTime(timeString: string): string {
        const today = new Date().toISOString().split('T')[0];
        const time = new Date(`${today}T${timeString}`);
        return time.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    private processOpenPracticeData(data: any): OpenPractice {
        const attributes = data.data.attributes;

        let combinedDateTime = null;
        if (attributes.Date && attributes.startTime) {
            const [year, month, day] = attributes.Date.split('-');
            const [hours, minutes] = attributes.startTime.split(':');
            combinedDateTime = new Date(year, month - 1, day, hours, minutes);
        }

        let combinedDateTime2 = null;
        if (attributes.Date2 && attributes.startTime2) {
            const [year, month, day] = attributes.Date2.split('-');
            const [hours, minutes] = attributes.startTime2.split(':');
            combinedDateTime2 = new Date(year, month - 1, day, hours, minutes);
        }

        if (typeof attributes.startTime === 'string') {
            attributes.startTime = this.formatTime(attributes.startTime);
        }
        if (typeof attributes.endTime === 'string') {
            attributes.endTime = this.formatTime(attributes.endTime);
        }
        if (typeof attributes.startTime2 === 'string') {
            attributes.startTime2 = this.formatTime(attributes.startTime2);
        }
        if (typeof attributes.endTime2 === 'string') {
            attributes.endTime2 = this.formatTime(attributes.endTime2);
        }

        return {
            ...attributes,
            combinedDateTime,
            combinedDateTime2
        };
    }

    private shouldFetchNewData(): boolean {
        const timestamp = sessionStorage.getItem(this.TIMESTAMP_KEY);
        if (!timestamp) return true;

        const lastFetch = parseInt(timestamp, 10);
        return Date.now() - lastFetch > this.CACHE_DURATION;
    }

    public getOpenPractice(): Observable<OpenPractice> {
        // Check if we need to fetch new data
        if (this.shouldFetchNewData() || !this.openPracticeSubject.getValue()) {
            return this.fetchOpenPracticeData();
        }

        return this.openPracticeSubject.asObservable().pipe(
            switchMap(data => {
                if (!data) {
                    return this.fetchOpenPracticeData();
                }
                return of(data);
            })
        );
    }

    private fetchOpenPracticeData(): Observable<OpenPractice> {
        const url = `${environment.strapiBaseUrl}/martin-open-practice?populate=*`;

        return this.http.get<any>(url).pipe(
            map(response => this.processOpenPracticeData(response)),
            tap(data => {
                this.openPracticeSubject.next(data);
                this.saveToSessionStorage(data);
            }),
            shareReplay(1)
        );
    }

    public clearCache(): void {
        sessionStorage.removeItem(this.CACHE_KEY);
        sessionStorage.removeItem(this.TIMESTAMP_KEY);
        this.openPracticeSubject.next(null);
    }

    public forceRefresh(): Observable<OpenPractice> {
        this.clearCache();
        return this.getOpenPractice();
    }
}
