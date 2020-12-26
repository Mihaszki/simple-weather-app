import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherDataService } from '../weather-data.service';
import { format } from 'date-fns'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  constructor(private route: ActivatedRoute, private weatherDataService: WeatherDataService, private titleService: Title) { }

  isError: boolean = false;
  isSuccess: boolean = false;
  city: string = '';
  errorMsg: string = 'There was an error!';
  jsonData: any;
  weatherBoxes: any[] = [];
  days: string[] = [];
  daysNames: string[] = [];
  selectedBox: number = 0;

  lineChartDataTemp: ChartDataSets[] = [
    { data: [], label: 'Temperature' }
  ];
  lineChartLabelsTemp: Label[] = [];

  lineChartOptions: (ChartOptions) = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          id: 'x-axis-0',
          gridLines: {
            display:false
          }
        },
      ],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          gridLines: {
            display:false
          },
          ticks: {
            stepSize: 1
          }
        },
      ]
    }
  };
  lineChartType: ChartType = 'line';

  // change selected item so you can hide/show it
  changeSelectedBox(i: number) {
    this.selectedBox = i;
    this.generateChart();
  }

  // get data from api
  getWeatherData() {
    this.weatherDataService.getWeatherData(this.city)
    .subscribe((data: any) => {
      this.jsonData = data;
      this.generatePage();
    },
    (error: any) => {
      this.isError = true;
      this.isSuccess = false;
      this.errorMsg = error;
    });
  }

  generatePage() {
    // show error message if api returns 404
    if(this.jsonData.cod == '404') {
      this.isError = true;
      this.isSuccess = false;
      this.errorMsg = this.jsonData.message;
    }
    else {
      this.isError = false;
      this.isSuccess = true;
      this.weatherBoxes = [];
      this.days = [];
      this.selectedBox = 0;
      this.daysNames = [];
      // parse the json data
      // get all different days
      for(let item of this.jsonData.list) {
        // convert unix time (item.dt) to text format without hours and minutes
        const day : string = format(new Date(item.dt * 1000), 'yyyy-MM-dd')
        // convert unix time to the names of the days (e.g: monday, tuesday...)
        const dayName : string = format(new Date(item.dt * 1000), 'iiii')
        if(!this.days.includes(day)) {
          this.days.push(day);
          this.daysNames.push(dayName);
        }
      }
      // sort object by days, each in different array index
      for(let day of this.days) {
        const regex = new RegExp(day, 'g');
        let filterArray = this.jsonData.list.filter((val: any) => {
            return val.dt_txt.match(regex)
        });
        this.weatherBoxes.push(filterArray);
      }
      this.generateChart();
    }
  }

  generateChart() {
    // replace labels and numbers with new json data
    this.lineChartLabelsTemp = [];
    const tempData: number[] = [];
    const humData: number[] = [];
    for(let weather of this.weatherBoxes[this.selectedBox]) {
      this.lineChartLabelsTemp.push(format(new Date(weather.dt * 1000), 'HH:mm'));
      tempData.push(parseFloat(weather.main.temp));
    }

    // if there's not enough data to show, get some from next day
    if(tempData.length < 4) {
      // get next day, or the first day from list
      const day = this.selectedBox + 1 < this.weatherBoxes.length ? this.selectedBox + 1 : 0;
      for(let weather of this.weatherBoxes[day]) {
        this.lineChartLabelsTemp.push(format(new Date(weather.dt * 1000), 'HH:mm'));
        tempData.push(parseFloat(weather.main.temp));
      }
    }

    this.lineChartDataTemp = [
      { data: tempData, label: 'Temperature' }
    ];
  }

  ngOnInit(): void {
    // get location from url
    this.route.paramMap.subscribe(params => {
      this.city = <string>params.get('city');
      this.titleService.setTitle(`Weather For: ${this.city.toUpperCase()}`);
      this.getWeatherData();
    });
  }

}
