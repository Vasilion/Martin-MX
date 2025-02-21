import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';
import { OpenPractice } from '../interfaces/responses';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OpenPracticeCacheService {
    private readonly CACHE_KEY = 'openPracticeData';
    private readonly TIMESTAMP_KEY = 'openPracticeTimestamp';
    private readonly CACHE_DURATION = 5 * 60 * 1000;

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
        if (this.shouldFetchNewData()) {
            const url = `${environment.strapiBaseUrl}/martin-open-practice?populate=*`;

            this.http
                .get<any>(url)
                .pipe(
                    map(response => this.processOpenPracticeData(response)),
                    tap(data => {
                        this.openPracticeSubject.next(data);
                        this.saveToSessionStorage(data);
                    }),
                    shareReplay(1)
                )
                .subscribe();
        }

        return this.openPracticeSubject.asObservable().pipe(
            map(data => {
                if (!data) {
                    throw new Error('No open practice data available');
                }
                return data;
            })
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
