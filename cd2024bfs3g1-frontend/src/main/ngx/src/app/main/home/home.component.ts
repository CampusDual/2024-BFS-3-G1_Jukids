import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OntimizeService } from 'ontimize-web-ngx';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { OMapComponent } from 'ontimize-web-ngx-map';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private latitude: any;
  private longitude: any;
  private location: any;
  public cols: number = 5;
  public queryrows: number = 5;
  public rows: number = 1;

  //============== Variable de URL BASE =================
  public baseUrl: string;

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
    private  toysMapService: ToysMapService,
    private breakpointObserver: BreakpointObserver,
  ) {
     //Configuración del servicio para poder ser usado
    const conf = this.ontimizeService.getDefaultServiceConfiguration('toys');
    this.ontimizeService.configureService(conf);
  }

  ngOnInit() {
    //Se escuchan los cambios del servicio
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    });

    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }

    //Control de columnas en o-grid
    this.layoutChanges.subscribe((result) => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.cols = 2;
        this.queryrows = 6;
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.cols = 3;
        this.queryrows = 3;
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.cols = 4;
        this.queryrows = 4;
      } else if (result.breakpoints[Breakpoints.Large]) {
        this.cols = 5;
        this.queryrows = 5;
      } else if (result.breakpoints[Breakpoints.XLarge]) {
        this.cols = 5;
        this.queryrows = 5;
      }
    });
  }

   navigate() {
     this.router.navigate(['../', 'login'], { relativeTo: this.actRoute });
   }

  @ViewChild('oMapBasic') oMapBasic: OMapComponent;

  //Insercion de la longuitud y la latitud del punto marcado en el mapa
  onMapClick(e) {
    this.latitude = e.latlng.lat;
    this.longitude = e.latlng.lng;
    let date: Date = new Date();

    this.oMapBasic.addMarker(
      1,
      this.latitude,
      this.longitude,
      false,
      true,
      false,
      false,
      false
    );

    const toy = {
      "data": {
        "name": "Locationontimize",
        "description": "Locationteamontimize",
        "dateadded": date.toISOString().split('T')[0],
        "price": 23.12,
        "photo": "sdad",
        "latitude": this.latitude,
        "longitude": this.longitude

      }
    };

    fetch('http://localhost:8080/toys/toy', {

      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('admin' + ":" + 'adminuser'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toy)
    })
  }

  public openDetail(data: any): void {
    // Aquí redirigimos a la ruta de detalle de juguete y pasamos el ID como parámetro
    const toyId = data.toyid; // Asegúrate de obtener el ID correcto de tu objeto de datos
    this.router.navigate(["./toys/toysDetail", toyId]);
  }

  searchCategory(category):void {
      this.router.navigate(['/main/toys'], {queryParams:{category: category}});
    }
}