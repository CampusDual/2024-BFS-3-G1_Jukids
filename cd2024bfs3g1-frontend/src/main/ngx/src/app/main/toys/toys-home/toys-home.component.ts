import { Component, OnInit, ViewChild } from "@angular/core";
import { Expression, FilterExpressionUtils, OComboComponent } from "ontimize-web-ngx";
import { OntimizeService, OGridComponent } from "ontimize-web-ngx";
import { ToysMapService } from "src/app/shared/services/toys-map.service";
import { DialogService, ODialogConfig } from "ontimize-web-ngx";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
 
@Component({
  selector: "app-toys-home",
  templateUrl: "./toys-home.component.html",
  styleUrls: ["./toys-home.component.scss"],
})
export class ToysHomeComponent implements OnInit{
  subscription: Subscription;
 
  @ViewChild("toysGrid") protected toyGrid: OGridComponent;
  @ViewChild("price") protected priceCombo: OComboComponent;
 
  private location: any;
  public arrayData: Array<any> = [];
 
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private ontimizeService: OntimizeService,
    protected dialogService: DialogService,
    private toysMapService: ToysMapService,
    protected dialog: MatDialog,
    protected sanitizer:DomSanitizer
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
      this.location = data;
      //Recargar el grid con las tarjetas
      this.toyGrid.reloadData();
    });
  }
 
  public openDetail(data: any): void {
    console.log("OPENDETAIL: ");
   
    // Aquí redirigimos a la ruta de detalle de juguete y pasamos el ID como parámetro
    const toyId = data.toyid; // Asegúrate de obtener el ID correcto de tu objeto de datos
 
    this.router.navigate(["/toysDetail", toyId]);
  }
  public getImageSrc(base64: any): any {
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64.bytes) : './assets/images/no-image-transparent.png';
  }
 
  navigate() {
    this.router.navigate(['../', 'login'], { relativeTo: this.actRoute });
  }
 
  //Se calcula la distancia a la que se encuentra el objeto al punto del mapa que sea a seleccionado previamente
  calculateDistance(rowData: any): number {
    const R: number = 6371; // Radio de la Tierra en kilómetros
    let isset = this.location != undefined;
    let lat1: number = (isset) ? this.location.latitude : 0;
    let lon1: number = (isset) ? this.location.longitude : 0;
 
    let lat2: number = rowData['latitude'];
    let lon2: number = rowData['longitude'];
 
    function deg2rad(deg: number): number {
      return deg * (Math.PI / 180);
    }
 
    let dLat: number = deg2rad(lat2 - lat1);
    let dLon: number = deg2rad(lon2 - lon1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;
    return Math.round(distance * 100.0) / 100.0; // Redondear a 2 decimales
  }
 
 
  //Se añade una localización a los datos recogidos del grid y existe un punto en el mapa
  addLocation(e) {
    if (this.location != undefined) {
      e.forEach(element => {
        element.location = this.calculateDistance(element);
      })
      //Ordenar el array por distancia
      e.sort((a, b) => a.location - b.location);
    }
    this.arrayData = e;
    //Inserción del nuevo array en los datos del grid
    this.toyGrid.dataArray = this.arrayData;
    this.toyGrid.pageSizeChanged();
  }
 

  createFilter(values: Array<{ attr: string, value: any }>): Expression {
    let filtersOR: Array<Expression> = [];
    let categoryExpressions: Array<Expression> = [];
    let priceExpressions: Array<Expression> = [];
  
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
      } else if (fil.attr === "PRICE") {
        // Construir expresión de precio
        priceExpressions.push(FilterExpressionUtils.buildExpressionLessEqual("PRICE", fil.value));
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
  
    // Construir la expresión final combinando filtersOR, categoryExpression y priceExpression
    let combinedExpression: Expression = null;
  
    if (filtersOR.length > 0) {
      combinedExpression = filtersOR.reduce((exp1, exp2) =>
        FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_OR)
      );
    }
  
    if (categoryExpression && priceExpression) {
      const andCategoryPrice = FilterExpressionUtils.buildComplexExpression(categoryExpression, priceExpression, FilterExpressionUtils.OP_AND);
      combinedExpression = combinedExpression
        ? FilterExpressionUtils.buildComplexExpression(combinedExpression, andCategoryPrice, FilterExpressionUtils.OP_AND)
        : andCategoryPrice;
    } else if (categoryExpression) {
      combinedExpression = combinedExpression
        ? FilterExpressionUtils.buildComplexExpression(combinedExpression, categoryExpression, FilterExpressionUtils.OP_AND)
        : categoryExpression;
    } else if (priceExpression) {
      combinedExpression = combinedExpression
        ? FilterExpressionUtils.buildComplexExpression(combinedExpression, priceExpression, FilterExpressionUtils.OP_AND)
        : priceExpression;
    }
  
    return combinedExpression;
  }
  
 
  clearFilters(): void {
    this.priceCombo.setValue(this.precioPredeterminado);
    this.toyGrid.reloadData();

  }
 
  formatPriceSlider(value: number | null) {
    if (!value) {
      return 0;
    }
 
    return value + "€";
  }

  public pricesArray = [{
    priceCode: 10,
    priceText: 'Menos de 10€'
  }, {
    priceCode: 20,
    priceText: 'Menos de 20€'
  }, {
    priceCode: 50,
    priceText: 'Menos de 50€'
  }, {
    priceCode: 1000000, //se pone un millon para q aparezcan todos los productos (no se cree q ningun juguete vaya a superar esta cifra)
    priceText: 'Todos'
  }];

  public precioPredeterminado = 1000000;
}