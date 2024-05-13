import { Component, ViewChild } from '@angular/core';
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
  }

  ngOnInit() {
    //Se escuchan los cambios del servicio
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    });
  }

  getPosition(e) {
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

    this.isMapLatLongSelected = true;
  }

}