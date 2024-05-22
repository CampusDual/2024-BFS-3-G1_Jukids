import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { OChartModule } from 'ontimize-web-ngx-charts';
import { ChartsComponent } from './charts/charts.component';


@NgModule({
  declarations: [
    ChartsComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    AdminRoutingModule,
    OChartModule
  ]
})
export class AdminModule { }
