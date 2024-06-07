import { Component, Input, ViewChild } from '@angular/core';
import { OntimizeService, DialogService } from 'ontimize-web-ngx';
import { ToysMapService } from '../../services/toys-map.service';
import { OMapComponent } from 'ontimize-web-ngx-map';

import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent {
  private location: any;
  latitude: number = 42.240599;
  longitude: number = -8.720727;
  public center:string = '42.240599, -8.720727';
  @Input() isEditable: boolean;

  @ViewChild('LocationMap') oMapBasic: OMapComponent;

  isMapLatLongSelected: boolean = false;

  constructor(
    private ontimizeService: OntimizeService,
    protected dialogService: DialogService,
    private toysMapService: ToysMapService
  ) {
    //Configuración del servicio para poder ser usado
    const conf = this.ontimizeService.getDefaultServiceConfiguration('toys');
    this.ontimizeService.configureService(conf);
    this.isEditable == undefined ? this.isEditable=true : "";
  }

  ngOnInit() {
    //Se escuchan los cambios del servicio
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
      this.latitude = this.location.latitude;
      this.longitude = this.location.longitude;
      this.center = this.latitude + ',' + this.longitude;
    });
  }
  handleClick(e) {
    this.isEditable && this.getPosition(e);
  }
  
  getPosition(e) {
    this.toysMapService.setLocation(e.latlng.lat, e.latlng.lng);
    this.createMarker(e.latlng.lat, e.latlng.lng);
  }

  hasLocation(){
    return (this.location != undefined && this.location.latitude != undefined && this.location.longitude != undefined);
  }

  getPoint(){
    if(this.hasLocation()){
      this.createMarker(this.latitude, this.longitude);
    }
    return this.center;
  }
  

  createMarker(lat, lng){
    this.oMapBasic.addMarker(
      1,
      lat,
      lng,
      false,
      true,
      false,
      false,
      false
    );

    this.isMapLatLongSelected = true;
  }


  	// Se crea un icono personalizado
/* 	locationIcon = L.icon({
		iconUrl: 'location_searching.svg',
		iconSize: [38, 95], // tamaño del icono
		}); */
	 
	// Se crea un objeto marcador, se establece la opción de icono personalizado y se añade al mapa en las coordenadas indicadas
	/* marker = L.marker([36.7204,-4.4150], {icon: locationIcon}).addTo(map); */


/*   var myIcon = L.icon({
    iconUrl: 'my-icon.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
}); */

/* L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
   */

}