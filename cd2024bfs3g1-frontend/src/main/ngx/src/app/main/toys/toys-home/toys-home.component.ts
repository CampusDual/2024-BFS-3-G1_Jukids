import { Component, OnInit, ViewChild } from "@angular/core";
import { Expression, FilterExpressionUtils } from "ontimize-web-ngx";
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
    let statusExpressions: Array<Expression> = [];
  
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
      }
    });
  
    // Construir la expresión OR para CATEGORY
    let categoryExpression: Expression = null;
    if (categoryExpressions.length > 0) {
      categoryExpression = categoryExpressions.reduce((exp1, exp2) => 
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
  
    // Construir la expresión final combinando filtersOR, categoryExpression y statusExpression
    let combinedExpression: Expression = null;
  
    if (filtersOR.length > 0) {
      combinedExpression = filtersOR.reduce((exp1, exp2) => 
        FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_OR)
      );
    }
  
    if (categoryExpression && statusExpression) {
      const andCategoryStatus = FilterExpressionUtils.buildComplexExpression(categoryExpression, statusExpression, FilterExpressionUtils.OP_AND);
      combinedExpression = combinedExpression
        ? FilterExpressionUtils.buildComplexExpression(combinedExpression, andCategoryStatus, FilterExpressionUtils.OP_AND)
        : andCategoryStatus;
    } else if (categoryExpression) {
      combinedExpression = combinedExpression
        ? FilterExpressionUtils.buildComplexExpression(combinedExpression, categoryExpression, FilterExpressionUtils.OP_AND)
        : categoryExpression;
    } else if (statusExpression) {
      combinedExpression = combinedExpression
        ? FilterExpressionUtils.buildComplexExpression(combinedExpression, statusExpression, FilterExpressionUtils.OP_AND)
        : statusExpression;
    }
  
    return combinedExpression;
  }
  

  clearFilters(): void {
    this.toyGrid.reloadData();
  }

}
