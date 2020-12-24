import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {WeatherDataService } from '../weather-data.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  public isError: boolean = false;
  public isSuccess: boolean = false;
  public city: string = '';
  public errorMsg: string = 'There was an error!';
  public jsonData: any;

  constructor(private route: ActivatedRoute, private weatherDataService: WeatherDataService) { }

  getWeatherData() {
    this.weatherDataService.getWeatherData(this.city)
    .subscribe((data: any) => {
      this.jsonData = data;
      this.generatePage();
    });
      
  }

  generatePage() {
    if(this.jsonData.cod == '404') {
      this.isError = true;
      this.isSuccess = false;
      this.errorMsg = this.jsonData.message;
    }
    else {
      this.isError = false;
      this.isSuccess = true;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.city = <string>params.get('city');
      this.getWeatherData();
    });
  }

}
