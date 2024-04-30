import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OGridComponent, OntimizeService } from 'ontimize-web-ngx';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { OMapComponent, OMapLayerComponent } from 'ontimize-web-ngx-map';
import { PopUpMapComponent } from 'src/app/shared/components/pop-up-map/pop-up-map.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-toy',
  templateUrl: './table-toy.component.html',
  styleUrls: ['./table-toy.component.css']
})

export class TableToyComponent {

  subscription:Subscription;

  @ViewChild('toysGrid') protected toyGrid: OGridComponent;

  private location: any;

  private arrayData: Array<any> = [];
  private arrayFilter: Array<any> = [];

  public selectedAll = 0;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private ontimizeService: OntimizeService,
    protected dialogService: DialogService,
    private toysMapService: ToysMapService,
    protected dialog: MatDialog
  ) {
    //Configuración del servicio para poder ser usado
    const conf = this.ontimizeService.getDefaultServiceConfiguration('toys');
    this.ontimizeService.configureService(conf);

  }

  ngOnInit() {
    //Se escuchan los cambios del servicio
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
      this.toyGrid.reloadData();
    });
  }

  navigate() {
    this.router.navigate(['../', 'login'], { relativeTo: this.actRoute });
  }

  @ViewChild('oMapBasic') oMapBasic: OMapComponent;

  //Se calcula la distancia a la que se encuentra el objeto al punto del mapa que sea a seleccionado previamente
  calculateDistance(rowData: any): number {
    const R: number = 6371; // Radio de la Tierra en kilómetros 
    let isset = this.location != undefined;
    let lat1: number =(isset)?this.location.latitude:0;
    let lon1: number =(isset)?this.location.longitude:0;

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
    this.arrayData = e;
    if (this.location != undefined){
      e.forEach(element => {
        element.location = this.calculateDistance(element);
      })
    }
  }

  public openMap(data: any): void {
    this.dialog.open(PopUpMapComponent, {
      height: '400px',
      width: '600px',
      data: {
        id: 'mapa',
        grid:this.toyGrid,
        service: this.toysMapService
      }
    });
  }
}