import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WeatherIconsService {
    /**
     * Maps WMO weather codes to icon filenames
     * Based on Open-Meteo's WMO weather interpretation codes
     * https://open-meteo.com/en/docs
     */
    getIconPath(weatherCode: number): string {
        const basePath = '/assets/icons/weather/';

        // Clear & Clouds
        if (weatherCode === 0) return `${basePath}clear-day.svg`;
        if (weatherCode === 1) return `${basePath}partly-cloudy-day.svg`;
        if (weatherCode === 2) return `${basePath}cloudy.svg`;
        if (weatherCode === 3) return `${basePath}overcast.svg`;

        // Fog
        if (weatherCode >= 45 && weatherCode <= 48) return `${basePath}fog.svg`;

        // Drizzle
        if (weatherCode >= 51 && weatherCode <= 55)
            return `${basePath}drizzle.svg`;
        if (weatherCode >= 56 && weatherCode <= 57)
            return `${basePath}freezing-drizzle.svg`;

        // Rain
        if (weatherCode >= 61 && weatherCode <= 65)
            return `${basePath}rain.svg`;
        if (weatherCode >= 66 && weatherCode <= 67)
            return `${basePath}freezing-rain.svg`;
        if (weatherCode >= 80 && weatherCode <= 82)
            return `${basePath}rain.svg`;

        // Snow
        if (weatherCode >= 71 && weatherCode <= 77)
            return `${basePath}snow.svg`;
        if (weatherCode >= 85 && weatherCode <= 86)
            return `${basePath}snow.svg`;

        // Thunderstorm
        if (weatherCode >= 95 && weatherCode <= 99)
            return `${basePath}thunderstorms.svg`;

        // Default icon for unknown codes
        return `${basePath}default.svg`;
    }

    /**
     * Returns a text description for a given weather code
     */
    getWeatherDescription(weatherCode: number): string {
        if (weatherCode === 0) return 'Clear Sky';
        if (weatherCode === 1) return 'Mainly Clear';
        if (weatherCode === 2) return 'Partly Cloudy';
        if (weatherCode === 3) return 'Overcast';
        if (weatherCode >= 45 && weatherCode <= 48) return 'Foggy';
        if (weatherCode >= 51 && weatherCode <= 55) return 'Light Drizzle';
        if (weatherCode >= 56 && weatherCode <= 57) return 'Freezing Drizzle';
        if (weatherCode >= 61 && weatherCode <= 65) return 'Rain';
        if (weatherCode >= 66 && weatherCode <= 67) return 'Freezing Rain';
        if (weatherCode >= 71 && weatherCode <= 77) return 'Snow';
        if (weatherCode >= 80 && weatherCode <= 82) return 'Rain Showers';
        if (weatherCode >= 85 && weatherCode <= 86) return 'Snow Showers';
        if (weatherCode >= 95 && weatherCode <= 99) return 'Thunderstorm';

        return 'Unknown';
    }

    getWeatherEmoji(weatherCode: number): string {
        if (weatherCode === 0) return '☀️';
        if (weatherCode === 1) return '🌤️';
        if (weatherCode === 2) return '⛅';
        if (weatherCode === 3) return '☁️';
        if (weatherCode >= 45 && weatherCode <= 48) return '🌫️';
        if (weatherCode >= 51 && weatherCode <= 57) return '🌦️';
        if (weatherCode >= 61 && weatherCode <= 67) return '🌧️';
        if (weatherCode >= 71 && weatherCode <= 77) return '❄️';
        if (weatherCode >= 80 && weatherCode <= 82) return '🌧️';
        if (weatherCode >= 85 && weatherCode <= 86) return '🌨️';
        if (weatherCode >= 95 && weatherCode <= 99) return '⛈️';
        return '🌡️';
    }
}
