import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-city',
  templateUrl: './form-city.component.html',
  styleUrls: ['./form-city.component.scss']
})
export class FormCityComponent implements OnInit {

  public isError: Boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
