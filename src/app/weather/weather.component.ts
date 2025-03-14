import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { WeatherIconsService } from '../services/weather-icons.service';

interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        precipitation: number;
        wind_speed_10m: number;
        weather_code: number;
    };
}

@Component({
    selector: 'app-weather',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: 'weather.component.html',
    styleUrls: ['weather.component.css']
})
export class WeatherComponent implements OnInit {
    weatherData: WeatherData | null = null;
    errorMessage: string = '';
    private lat = 42.5359;
    private lon = -85.6386;

    constructor(
        private http: HttpClient,
        private weatherIconsService: WeatherIconsService
    ) {}

    ngOnInit(): void {
        this.getWeatherData().subscribe(
            data => {
                this.weatherData = data;
            },
            error => {
                this.errorMessage = 'Unable to load weather data';
                console.error('Weather API error:', error);
            }
        );
    }

    getWeatherData(): Observable<WeatherData> {
        // Using Open-Meteo API which is free without API key
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`;

        return this.http.get<WeatherData>(url).pipe(
            catchError(error => {
                console.error('Error fetching weather data:', error);
                return of({} as WeatherData);
            })
        );
    }

    getWeatherCondition(): string {
        if (!this.weatherData) return '';
        return this.weatherIconsService.getWeatherDescription(
            this.weatherData.current.weather_code
        );
    }

    getWeatherIcon(): string {
        if (!this.weatherData) return '';
        return this.weatherIconsService.getWeatherEmoji(
            this.weatherData.current.weather_code
        );
    }
}
