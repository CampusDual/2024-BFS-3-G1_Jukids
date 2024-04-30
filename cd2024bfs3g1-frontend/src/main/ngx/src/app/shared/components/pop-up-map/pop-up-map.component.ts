import { Component, ViewChild } from '@angular/core';
import { OntimizeService, DialogService } from 'ontimize-web-ngx';
import { ToysMapService } from '../../services/toys-map.service';
import { OMapComponent } from 'ontimize-web-ngx-map';

@Component({
  selector: 'app-pop-up-map',
  templateUrl: './pop-up-map.component.html',
  styleUrls: ['./pop-up-map.component.css']
})
export class PopUpMapComponent{
  private location: any;
  @ViewChild('PopUpMap') oMapBasic: OMapComponent;

  constructor(    
    private ontimizeService: OntimizeService,
    protected dialogService: DialogService,
    private toysMapService: ToysMapService
  ) 
  {
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
    if (this.dialogService) {
        if(window.confirm('¿Desea buscar para esta ubicación?'))
        {
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
        }
    }
  }
}