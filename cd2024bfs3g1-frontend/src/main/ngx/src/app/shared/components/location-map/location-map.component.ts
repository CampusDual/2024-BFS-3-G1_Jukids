import { Component, Input, ViewChild } from '@angular/core';
import { OntimizeService, DialogService, OTranslateService } from 'ontimize-web-ngx';
import { ToysMapService } from '../../services/toys-map.service';
import { OMapComponent } from 'ontimize-web-ngx-map';
import * as L from 'leaflet';

@Component({
  selector: 'location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent {

  //Variables para el método del marker
  map: L.Map;
  markers: L.Marker[] = [];

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
    private toysMapService: ToysMapService,
    private translate: OTranslateService,
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

  //Método para crear un marker con un icono custom - según nuevo diseño
  createMarker(lat: number, lng: number): void {
    this.clearMarkers(); //se limpian los anteriores
    const iconUrl = '../assets/icons/pin-mapa.png';
    //se crea instancia del icono custom
    const locationIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [28, 36],
      iconAnchor: [14, 36],
    });
    //se crea marcador
    const marker = L.marker([lat, lng], {
    icon: locationIcon
    })
    .addTo(this.oMapBasic.getLMap());

    this.isMapLatLongSelected = true;
    this.markers.push(marker);
    }

  //Método para limpiar puntos marcados antes en el mapa
  clearMarkers() {
    for (const marker of this.markers) {
      marker.remove();
    }
      this.markers = [];
  }

}
