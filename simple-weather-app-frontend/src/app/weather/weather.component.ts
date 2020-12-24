import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  public isError: boolean = false;
  public location: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.location = <string>this.route.snapshot.paramMap.get('city');
  }

}
