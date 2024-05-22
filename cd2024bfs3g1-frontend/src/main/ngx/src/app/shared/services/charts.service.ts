import { Injectable, ChangeDetectorRef } from '@angular/core';
import { OntimizeService } from 'ontimize-web-ngx';
import { LineChartConfiguration } from 'ontimize-web-ngx-charts';
import { Subscription } from 'rxjs';
import { OTranslateService } from 'ontimize-web-ngx';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  public movementTypesChartParams: LineChartConfiguration;
  protected resData: Array<Object>;//Datos recogidos
  protected graphData: Array<Object>;//Datos preparados para el gráfico
  private subscription: Subscription;
  private translateServiceSubscription: Subscription;

  constructor(
    private ontimizeService: OntimizeService,
    private cd: ChangeDetectorRef, //Detecta los cambios
    private translateService: OTranslateService
  ) {
    this._configureLineChart();
  }

  // Método para inicializar la consulta y suscripciones
  //TODO: Cambiar 'servicio', 'campos' y 'endpoint' por los valores correspondientes
  public initializeChartData() {
    this.ontimizeService.configureService(this.ontimizeService.getDefaultServiceConfiguration('servicio'));
    this.subscription = this.ontimizeService.query(void 0, ['campos'], 'endpoint').subscribe({
      next: (res: any) => {
        if (res && res.data.length && res.code === 0) {
          this.resData = res.data;
          this.adaptResult(res.data);
        }
      },
      error: (err: any) => console.log(err),
      complete: () => this.cd.detectChanges()//Cambia la vista si detecta los cambios
    });

    this.translateServiceSubscription = this.translateService.onLanguageChanged.subscribe(() => {
      this.adaptResult(this.resData);
    });
  }

  // Método para cancelar suscripciones, se aplica si se borra alguna gráfica para evitar
  // errores de memoria
  public cleanup() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.translateServiceSubscription) {
      this.translateServiceSubscription.unsubscribe();
    }
  }

  private _configureLineChart(): void {
    this.movementTypesChartParams = new LineChartConfiguration();
    this.movementTypesChartParams.margin.top = 0;
    this.movementTypesChartParams.margin.right = 0;
    this.movementTypesChartParams.margin.bottom = 0;
    this.movementTypesChartParams.margin.left = 0;
    this.movementTypesChartParams.legendPosition = "right";
  }

  private adaptResult(data: any) {
    if (data && data.length) {
      let values = this.processValues(data);
      this.graphData = values;
    }
  }


  //TODO: Cambiar nombre y valor por los elementos correspondientes
  private processValues(data: any) {
    let values = [];
    data.forEach((item: any) => {
      values.push({
        'nombre': item['nombre'],
        'valor': item['valor']
      });
    });
    return values;
  }
}
