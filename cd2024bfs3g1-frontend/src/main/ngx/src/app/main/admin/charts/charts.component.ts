import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OntimizeService } from 'ontimize-web-ngx';
import { LineChartConfiguration } from 'ontimize-web-ngx-charts';
import { Subscription } from 'rxjs';
import { OTranslateService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  encapsulation: ViewEncapsulation.None, //Permite aplicar estilos globales (evitamos posibles conflictos con el tema)
})
export class ChartsComponent implements OnInit {
  public movementTypesChartParams: LineChartConfiguration;
  protected resData: Array<Object>; //Datos obtenidos del servicio
  protected graphData: Array<Object>; //Datos procesados para el gráfico
  private subscription: Subscription; //Suscripción a la consulta
  private translateServiceSubscription: Subscription; //Suscripción al cambio de idioma

  constructor(
    private ontimizeService: OntimizeService,
    private cd: ChangeDetectorRef, //Detecta los cambios
    private translateService: OTranslateService
  ) {
    this._configureLineChart();
  }


  //TODO: Cambiar 'servicio', 'campos' y 'endpoint' por los valores necesarios
  ngOnInit() {
    //Servicio de Ontimize con la configuración predeterminada
    this.ontimizeService.configureService(this.ontimizeService.getDefaultServiceConfiguration('servicio'));
    this.subscription = this.ontimizeService.query(void 0, ['campos'], 'endpoint').subscribe({
      next: (res: any) => {
        if (res && res.data.length && res.code === 0) {
          this.resData = res.data;
          this.adaptResult(res.data);
        }
      },
      error: (err: any) => console.log(err),
      complete: () => this.cd.detectChanges() //Detecta cambios para actualizar la vista
    });

    this.translateServiceSubscription = this.translateService.onLanguageChanged.subscribe(() => {
      this.adaptResult(this.resData);
    });
  }

  private _configureLineChart(): void {
    this.movementTypesChartParams = new LineChartConfiguration();
    this.movementTypesChartParams.margin.top = 0;
    this.movementTypesChartParams.margin.right = 0;
    this.movementTypesChartParams.margin.bottom = 0;
    this.movementTypesChartParams.margin.left = 0;
    this.movementTypesChartParams.legendPosition = "right";
  }

  adaptResult(data: any) {
    if (data && data.length) {
      let values = this.processValues(data);
      this.graphData = values;
    }
  }


  //TODO: Cambiar 'nombre' y 'valor' por los elementos correspondientes
  processValues(data: any) {
    let values = [];
    data.forEach((item: any) => {
      values.push({
        'nombre': item['nombre'],
        'valor': item['valor']
      });
    });
    return values;
  }

  ngOnDestroy() {
    /*Cancela las suscripciones al eliminar el componente en caso de que se haga
    se ha implementado aquí para ahorrarnos problemas a futuro si generamos más de
    una gráfica*/
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.translateServiceSubscription.unsubscribe();
    }
  }
}
