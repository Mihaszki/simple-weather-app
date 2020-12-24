import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-form-city',
  templateUrl: './form-city.component.html',
  styleUrls: ['./form-city.component.scss']
})
export class FormCityComponent implements OnInit {
  public isSubmitted: boolean = false;
  public cityForm = new FormGroup({
    city: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    this.isSubmitted = true;
    if(!this.cityForm.invalid) {
      console.log(this.cityForm.controls.city.value);
      this.router.navigate(['../weather', this.cityForm.controls.city.value], { relativeTo: this.activatedRoute });
    }
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

}
