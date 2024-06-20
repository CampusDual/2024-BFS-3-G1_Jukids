import { AfterViewChecked, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { OTranslateService } from 'ontimize-web-ngx';
import { OChartComponent } from 'ontimize-web-ngx-charts';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  @ViewChild('discretebar') discretebar: OChartComponent;
  @ViewChild('pieChart') pieChart: OChartComponent;
  @ViewChild('incomeChart') incomeChart: OChartComponent;

  //Color Scheme
  customColorScheme = {
    domain: [
      '#e0f2f1',
      '#b2dfdb',
      '#80cbc4',
      '#4db6ac',
      '#26a69a',
      '#009688',
      '#00897b',
      '#00796b',
      '#00695c',
      '#004d40',
      '#b2dfdb',
      '#80cbc4',
      '#26a69a',
      '#009688'
    ]
  };


  constructor(
    private translate: OTranslateService
  ) { 

    

  }

  ngOnInit(): void {
    this.dateFormat = this.dateFormat.bind(this);

    //Al cambiar el idioma se recarga los graficos
    this.translate.onLanguageChanged.subscribe(() => {
        this.discretebar.reloadData();
        this.incomeChart.reloadData();
        this.pieChart.reloadData();
    });
  }

  public dateFormat(date: number): string {
    const formattedDate = (date !== undefined) ? new Date(date).toLocaleDateString('es-ES', { month: '2-digit', year: '2-digit' }) : '';
    return formattedDate;
  }

}
