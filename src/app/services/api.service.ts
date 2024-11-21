import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) {
        console.log('ApiService');
    }

    public getAbout(): Observable<any> {
        let url = environment.strapiBaseUrl + '/martin-about' + '?populate=*';
        return this.http.get(url);
    }

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
}
