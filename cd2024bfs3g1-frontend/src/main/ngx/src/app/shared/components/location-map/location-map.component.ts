import { Component, Input, ViewChild } from '@angular/core';
import { OntimizeService, DialogService } from 'ontimize-web-ngx';
import { ToysMapService } from '../../services/toys-map.service';
import { OMapComponent } from 'ontimize-web-ngx-map';

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

  @ViewChild('LocationMap') oMapBasic: OMapComponent;

  constructor(
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
      this.latitude = this.location.latitude;
      this.longitude = this.location.longitude;
      this.center = this.latitude + ',' + this.longitude;
    });
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
  }
  

}