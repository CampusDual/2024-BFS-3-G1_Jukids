import { Component } from '@angular/core';
import { OChartComponent,LineChartConfiguration, ChartService  } from 'ontimize-web-ngx-charts'

@Component({
  selector: 'line',
  templateUrl: './charts.component.html'
})

export class PieComponent{
  chartParameters: LineChartConfiguration;

  constructor() {
    this.chartParameters = new LineChartConfiguration();
    this.chartParameters.isArea = [true];
    this.chartParameters.interactive = false;
    this.chartParameters.useInteractiveGuideline = false;
  }
}