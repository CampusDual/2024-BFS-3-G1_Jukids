import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OGridComponent, OntimizeService } from 'ontimize-web-ngx';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { calculateDistanceFunction } from 'src/app/shared/shared.module';
import { OMapComponent, OMapLayerComponent } from 'ontimize-web-ngx-map';
import { OMapBaseLayerComponent } from 'ontimize-web-ngx-map';
import { element } from 'protractor';

@Component({
  selector: 'app-table-toy',
  templateUrl: './table-toy.component.html',
  styleUrls: ['./table-toy.component.css']
})

export class TableToyComponent {
  @ViewChild('toysGrid') protected toyGrid: OGridComponent;
  private location: any;

  private arrayData: Array<any> = [];
  private arrayFilter: Array<any> = [];

  public selectedAll = 0
  public rangeArray = [{
    code: 0,
    range: "Ver todos"
  },
  {
    code: 50,
    range: "a menos de 50km"
  },
  {
    code: 100,
    range: "a menos de 100km"
  },
  {
    code: 200,
    range: "a menos de 200km"
  }
  ]

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private ontimizeService: OntimizeService,
    protected dialogService: DialogService,
    private toysMapService: ToysMapService
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
  }

  navigate() {
    this.router.navigate(['../', 'login'], { relativeTo: this.actRoute });
  }

  @ViewChild('oMapBasic') oMapBasic: OMapComponent;
  @ViewChild('oMapBasic') oMapLayer: OMapLayerComponent;

  //Obtencion de latitud y longitud del mapa y llamada al servicio para pasarle los datos
  getPosition(e) {
    if (this.dialogService) {
      if (window.confirm('¿Desea buscar para esta ubicación?')) {
        this.toysMapService.setLocation(e.latlng.lat, e.latlng.lng);

        this.oMapBasic.addMarker(
          1,
          e.latlng.lat,
          e.latlng.lng,
          false,
          true,
          false,
          false,
          false
        );

        // const layerConf = {
        //   layerId: 'circleLayer',
        //   layerGroupId: '',
        //   type: 'circle',
        //   center: { latitude: e.latlng.lat, longitude: e.latlng.lng },
        //   radius: 10000,
        //   fillColor: 'rgba(255, 140, 0, 0.7)',
        //   strokeColor: '#FFA500',
        //   strokeWeight: 2,
        //   points: [],
        //   bounds: null,
        //   popup: null,
        //   menuLabel: 'Radio de Compra',
        //   menuLabelSecondary: '',
        //   service: null,
        //   baseUrl: '',
        //   popupUrl: '',
        //   popupOptions: null,
        //   style: null,
        //   url: '',
        //   attribution: '',
        //   options: {},
        //   showInMenu: '',
        //   selected: true,
        //   visible: true,
        //   inWS: false,
        //   contextmenu: null
        // };

        // this.oMapLayer.createMapLayer(layerConf);

      }
    }

    this.toyGrid.reloadData();

  }

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

  getValue(e) {
    console.log(e);
    console.log("esto es getValue en rango")
  }


  filterKm(num: number) {
    console.log(num);
    
    this.arrayFilter = [];
    this.arrayData.forEach(element => {
      if (element.location !== undefined && num != 0) {
        console.log("hol")
        if (element.location <= num) {
          this.arrayFilter.push(element);
        }
      } else {
        this.arrayFilter.push(element);
      }
    });

    //se cambia la data del grid por los que coinciden con el filtro, pero toy grid tiene una variable interna (dataResponseArray) que hace que en memoria siempre esten todos los datos (por ello siempre podemos darle a ver mas)
    this.toyGrid.dataArray = this.arrayFilter;
    console.log(this.toyGrid)
  }




}

