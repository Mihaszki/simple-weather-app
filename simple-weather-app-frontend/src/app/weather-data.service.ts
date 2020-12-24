import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  private apiUrl: string = 'http://localhost:3000/location/';

  getWeatherData(city: string) {
    return this.http.get<any>(this.apiUrl + city);
  }

  constructor(private http: HttpClient) { }
}
