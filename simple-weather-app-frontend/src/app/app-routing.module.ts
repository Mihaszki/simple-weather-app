import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';

const routes: Routes = [
  { path: 'weather', redirectTo: '/', pathMatch: 'full' },
  { path: 'weather/:name', component: WeatherComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
