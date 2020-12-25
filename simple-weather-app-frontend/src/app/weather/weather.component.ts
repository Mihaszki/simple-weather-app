import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherDataService } from '../weather-data.service';
import { format } from 'date-fns'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  constructor(private route: ActivatedRoute, private weatherDataService: WeatherDataService) { }

  public isError: boolean = false;
  public isSuccess: boolean = false;
  public city: string = '';
  public errorMsg: string = 'There was an error!';
  public jsonData: any;
  public weatherBoxes: any[] = [];
  public days: string[] = [];
  public daysNames: string[] = [];
  public selectedBox: number = 0;

  public lineChartDataTemp: ChartDataSets[] = [
    { data: [], label: 'Temperature' }
  ];
  public lineChartLabelsTemp: Label[] = [];

  public lineChartOptions: (ChartOptions) = {
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
  public lineChartType: ChartType = 'line';

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
      console.log(this.days);
      console.log(this.daysNames);
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
    // replace labels and numbers with json data
    this.lineChartLabelsTemp = [];
    const tempData: number[] = [];
    const humData: number[] = [];
    for(let weather of this.weatherBoxes[this.selectedBox]) {
      this.lineChartLabelsTemp.push(format(new Date(weather.dt * 1000), 'HH:mm'));
      tempData.push(parseFloat(weather.main.temp));
    }

    this.lineChartDataTemp = [
      { data: tempData, label: 'Temperature' }
    ];
  }

  ngOnInit(): void {
    // get location from url
    this.route.paramMap.subscribe(params => {
      this.city = <string>params.get('city');
      this.getWeatherData();
    });
  }

}
