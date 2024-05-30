import { Component, OnInit, ViewChild } from "@angular/core";
import { Expression, FilterExpressionUtils, OComboComponent, OFilterBuilderComponent, OTextInputComponent } from "ontimize-web-ngx";
import { OntimizeService, OGridComponent } from "ontimize-web-ngx";
import { ToysMapService } from "src/app/shared/services/toys-map.service";
import { DialogService, ODialogConfig } from "ontimize-web-ngx";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { LocationMapComponent } from "src/app/shared/components/location-map/location-map.component";

@Component({
  selector: "app-toys-home",
  templateUrl: "./toys-home.component.html",
  styleUrls: ["./toys-home.component.scss"],
})
export class ToysHomeComponent implements OnInit {
  subscription: Subscription;

  @ViewChild("toysGrid") protected toyGrid: OGridComponent;
  @ViewChild("price") protected priceCombo: OComboComponent;
  @ViewChild('filterBuilder') filterBuilder: any;
  @ViewChild("range") protected rangeCombo: OComboComponent;

  //============== Variable de URL BASE =================
  public baseUrl: string;


  //================= Variable de RANGO  =================
  // public selectedAll = 0
  // public rangeArray = [{
  //   code: 0,
  //   range: "Ver todos"
  // },
  // {
  //   code: 50,
  //   range: "a menos de 50km"
  // },
  // {
  //   code: 100,
  //   range: "a menos de 100km"
  // },
  // {
  //   code: 200,
  //   range: "a menos de 200km"
  // }
  // ]

  public cols: number = 5;
  private location: any;
  public arrayData: Array<any> = [];


  @ViewChild('latInput')
  public latInput: OTextInputComponent;

  @ViewChild('longInput')
  public longInput: OTextInputComponent;

  @ViewChild('filterBuilder')
  public filterBuilder: OFilterBuilderComponent;

  private layoutChanges = this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ]);

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private ontimizeService: OntimizeService,
    protected dialogService: DialogService,
    private toysMapService: ToysMapService,
    protected dialog: MatDialog,
    protected sanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
  ) {
    //Configuración del servicio para poder ser usado
    const conf = this.ontimizeService.getDefaultServiceConfiguration('byuser');
    this.ontimizeService.configureService(conf);

    // Inicializar el precio predeterminado
    this.precioPredeterminado = 1000000; // Valor que representa "Todos" los precios

  }

  ngOnInit() {
    //Se escuchan los cambios del servicio
    this.toysMapService.getLocation().subscribe(data => {

      this.latInput.setValue(data.latitude);
      this.longInput.setValue(data.longitude);

      console.log(this.latInput.getValue());
      console.log(this.longInput.getValue());
      console.log(this.longInput.isEmpty());

      //Recargar el grid con las tarjetas
      console.log("DATAARRAY:", this.toyGrid.dataArray);
      console.log("DATAARRAY:", this.toyGrid.getDataArray());


      this.toyGrid.reloadData();



      // this.toyGrid.dataArray.forEach(element => {
      //   console.log(element.latitude);
      //   console.log(element.longitude);
      // })


    });

    //Control de columnas en o-grid
    this.layoutChanges.subscribe((result) => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.cols = 2;
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.cols = 3;
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.cols = 4;
      } else if (result.breakpoints[Breakpoints.Large]) {
        this.cols = 5;
      } else if (result.breakpoints[Breakpoints.XLarge]) {
        this.cols = 5;
      }
    });

    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }

  }

  public openDetail(data: any): void {
    console.log("OPENDETAIL: ");

    // Aquí redirigimos a la ruta de detalle de juguete y pasamos el ID como parámetro
    const toyId = data.toyid; // Asegúrate de obtener el ID correcto de tu objeto de datos

    this.router.navigate(["/toysDetail", toyId]);
  }

  navigate() {
    this.router.navigate(['../', 'login'], { relativeTo: this.actRoute });
  }

  //Se calcula la distancia a la que se encuentra el objeto al punto del mapa que sea a seleccionado previamente
  // calculateDistance(rowData: any): number {
  //   const R: number = 6371; // Radio de la Tierra en kilómetros
  //   let isset = this.location != undefined;
  //   let lat1: number = (isset) ? this.location.latitude : 0;
  //   let lon1: number = (isset) ? this.location.longitude : 0;

  //   let lat2: number = rowData['latitude'];
  //   let lon2: number = rowData['longitude'];

  //   function deg2rad(deg: number): number {
  //     return deg * (Math.PI / 180);
  //   }

  //   let dLat: number = deg2rad(lat2 - lat1);
  //   let dLon: number = deg2rad(lon2 - lon1);
  //   let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
  //     + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
  //     * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   let distance = R * c;
  //   return Math.round(distance * 100.0) / 100.0; // Redondear a 2 decimales
  // }


  //Se añade una localización a los datos recogidos del grid y existe un punto en el mapa
  // addLocation(e) {
  //   if (this.location != undefined) {
  //     e.forEach(element => {
  //       element.location = this.calculateDistance(element);
  //     })
  //     //Ordenar el array por distancia
  //     e.sort((a, b) => a.location - b.location);
  //   }
  //   this.arrayData = e;
  //   //Inserción del nuevo array en los datos del grid
  //   this.toyGrid.dataArray = this.arrayData;
  //   this.toyGrid.pageSizeChanged();
  // }

  createFilter(values: Array<{ attr: string, value: any }>): Expression {
    let filtersOR: Array<Expression> = [];
    let categoryExpressions: Array<Expression> = [];
    let priceExpressions: Array<Expression> = [];
    let statusExpressions: Array<Expression> = [];
    let latLongExpressions: Array<Expression> = [];


    console.log(values);


    values.forEach(fil => {
      if (!fil.value) return; // Salir temprano si no hay valor

      if (fil.attr === "DESCRIPTION" || fil.attr === "NAME") {
        filtersOR.push(FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value));
      } else if (fil.attr === "CATEGORY") {
        if (Array.isArray(fil.value)) {
          fil.value.forEach(val => {
            categoryExpressions.push(FilterExpressionUtils.buildExpressionLike(fil.attr, val));
          });
        } else {
          categoryExpressions.push(FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value));
        }
      } else if (fil.attr === "STATUS") {
        if (Array.isArray(fil.value)) {
          fil.value.forEach(val => {
            statusExpressions.push(FilterExpressionUtils.buildExpressionLike(fil.attr, val));
          });
        } else {
          statusExpressions.push(FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value));
        }
      } else if (fil.attr === "PRICE") {
        priceExpressions.push(FilterExpressionUtils.buildExpressionLessEqual("PRICE", fil.value));
      } else if (fil.attr === "LATITUDE") {
        latLongExpressions.push(FilterExpressionUtils.buildExpressionLessEqual("LATITUDE", fil.value));
      } else if (fil.attr === "LONGITUDE") {
        latLongExpressions.push(FilterExpressionUtils.buildExpressionLessEqual("LONGITUDE", fil.value));
      }


    });

    // Construir la expresión OR para CATEGORY
    let categoryExpression: Expression = null;
    if (categoryExpressions.length > 0) {
      categoryExpression = categoryExpressions.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_OR)
      );
    }

    // Construir la expresión OR para el precio
    let priceExpression: Expression = null;
    if (priceExpressions.length > 0) {
      priceExpression = priceExpressions.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_OR)
      );
    }

    // Construir la expresión OR para STATUS
    let statusExpression: Expression = null;
    if (statusExpressions.length > 0) {
      statusExpression = statusExpressions.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_OR)
      );
    }

    // Construir la expresión OR para filtersOR
    let combinedExpression: Expression = null;
    if (filtersOR.length > 0) {
      combinedExpression = filtersOR.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_OR)
      );
    }

     // Construir la expresión OR para el precio
     let latLongExpresion: Expression = null;
     if (latLongExpressions.length > 0) {
        latLongExpresion = latLongExpressions.reduce((exp1, exp2) =>
         FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_OR)
       );
     }

    // Combinar todas las expresiones con AND
    const expressionsToCombine = [combinedExpression, categoryExpression, priceExpression, statusExpression, latLongExpresion].filter(exp => exp !== null);
    if (expressionsToCombine.length > 0) {
      combinedExpression = expressionsToCombine.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_AND)
      );
    }

    return combinedExpression;
  }


  clearFilters(): void {
    this.priceCombo.setValue(this.precioPredeterminado);
    this.toyGrid.reloadData();

  }

  public pricesArray = [
    {
    attr_price: 'priceCode_10',
    priceCode: 10,
    priceText: 'Menos de 10€'
  }, {
    attr_price: 'priceCode_20',
    priceCode: 20,
    priceText: 'Menos de 20€'
  }, {
    attr_price: 'priceCode_50',
    priceCode: 50,
    priceText: 'Menos de 50€'
  }];

  public precioPredeterminado = 1000000;
}
