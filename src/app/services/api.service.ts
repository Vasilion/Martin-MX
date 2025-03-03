import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { PracticeSpotsLeft } from '../interfaces/responses';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) {}

    public getSponsors(): Observable<any> {
        let url =
            environment.strapiBaseUrl + '/martin-sponsors' + '?populate=*';
        return this.http
            .get(url)
            .pipe(
                map((data: any) =>
                    data.data.map((data: any) => data.attributes)
                )
            );
    }

    public getRiderList(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-rider-sign-up-lists' +
            '?populate=*';
        return this.http
            .get(url)
            .pipe(
                map((data: any) =>
                    data.data.map((data: any) => data.attributes)
                )
            );
    }

    public getSchedule(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-schedules' +
            '?populate=*&pagination[limit]=-1';
        return this.http
            .get(url)
            .pipe(
                map((data: any) =>
                    data.data.map((data: any) => data.attributes)
                )
            );
    }

    public getMainTrackPhotos(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-main-track-photos' +
            '?populate=*';
        return this.http
            .get(url)
            .pipe(
                map((data: any) =>
                    data.data.map((data: any) => data.attributes)
                )
            );
    }

    public getYouthTrackPhotos(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-youth-track-photos' +
            '?populate=*';
        return this.http
            .get(url)
            .pipe(
                map((data: any) =>
                    data.data.map((data: any) => data.attributes)
                )
            );
    }

    public getGallery(): Observable<any> {
        let url =
            environment.strapiBaseUrl + '/martin-galleries' + '?populate=*';
        return this.http
            .get(url)
            .pipe(
                map((data: any) =>
                    data.data.map((data: any) => data.attributes)
                )
            );
    }

    public getOpenClassABSpotsLeft(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-open-practice-ab' +
            '?populate=*';
        return this.http
            .get(url)
            .pipe(map((data: any) => data.data.attributes));
    }

    public getOpenClassCSpotsLeft(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-open-practice-c' +
            '?populate=*';
        return this.http
            .get(url)
            .pipe(map((data: any) => data.data.attributes));
    }

    public getOpenClassMiniSpotsLeft(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-open-practice-mini' +
            '?populate=*';
        return this.http
            .get(url)
            .pipe(map((data: any) => data.data.attributes));
    }

    public getOpenClassJRSpotsLeft(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-open-practice-jr-track' +
            '?populate=*';
        return this.http
            .get(url)
            .pipe(map((data: any) => data.data.attributes));
    }

    public updateOpenClassABSpotsLeft(
        spotsLeft: number
    ): Observable<PracticeSpotsLeft> {
        let url =
            environment.strapiBaseUrl +
            '/martin-open-practice-ab' +
            '?populate=*';
        const request = {
            data: {
                numberOfSpotsLeft: spotsLeft
            }
        };
        return this.http
            .put(url, request)
            .pipe(map((data: any) => data.data.attributes));
    }

    public updateOpenClassCSpotsLeft(
        spotsLeft: number
    ): Observable<PracticeSpotsLeft> {
        let url =
            environment.strapiBaseUrl +
            '/martin-open-practice-c' +
            '?populate=*';
        const request = {
            data: {
                numberOfSpotsLeft: spotsLeft
            }
        };
        return this.http
            .put(url, request)
            .pipe(map((data: any) => data.data.attributes));
    }

    public updateOpenClassMiniSpotsLeft(
        spotsLeft: number
    ): Observable<PracticeSpotsLeft> {
        let url =
            environment.strapiBaseUrl +
            '/martin-open-practice-mini' +
            '?populate=*';
        const request = {
            data: {
                numberOfSpotsLeft: spotsLeft
            }
        };
        return this.http
            .put(url, request)
            .pipe(map((data: any) => data.data.attributes));
    }

    public getOpenSignUp(): Observable<any> {
        let url =
            environment.strapiBaseUrl + '/martin-open-practice' + '?populate=*';
        return this.http.get(url);
    }

    public getUnlimitedSignUp(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-unlimited-sign-up' +
            '?populate=*';
        return this.http.get(url);
    }
}
