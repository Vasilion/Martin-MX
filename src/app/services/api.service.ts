import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) { }


    public getEvents(): Observable<any> {
        let url = environment.strapiBaseUrl + '/martin-events' + '?populate=*';
        return this.http.get(url).pipe(
            map((data: any) => data.data.map((data: any) => data.attributes)));
    }

    public getMainTrackPhotos(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-main-track-photos' +
            '?populate=*';
        return this.http.get(url).pipe(
            map((data: any) => data.data.map((data: any) => data.attributes)));
    }

    public getYouthTrackPhotos(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-youth-track-photos' +
            '?populate=*';
        return this.http.get(url).pipe(
            map((data: any) => data.data.map((data: any) => data.attributes)));
    }

    public getGallery(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-galleries' +
            '?populate=*';
        return this.http.get(url).pipe(
            map((data: any) => data.data.map((data: any) => data.attributes)));
    }

    public getOpenSignUp(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-open-practice' +
            '?populate=*';
        return this.http.get(url);
    }

    public getYearlySignUp(): Observable<any> {
        let url =
            environment.strapiBaseUrl +
            '/martin-yearly-sign-up' +
            '?populate=*';
        return this.http.get(url);
    }
}
