import { Component, OnInit, ViewChild, ViewRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OntimizeService, DialogService, OGridComponent } from 'ontimize-web-ngx';
import { ToysMapService } from '../../services/toys-map.service';
import { TableToyComponent } from 'src/app/main/home/table-toy/table-toy.component';

@Component({
  selector: 'app-pop-up-map',
  templateUrl: './pop-up-map.component.html',
  styleUrls: ['./pop-up-map.component.css']
})
export class PopUpMapComponent{
  private location: any;

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

  closePopUpMap() {
    let a = this.dialogService;
  }

  getPosition(e) {
    console.log("En getPosition en el PopUp");
    console.log(e.latlng.lat)
    console.log(e.latlng.lng)
    if (this.dialogService) {
        if(window.confirm('¿Desea buscar para esta ubicación?'))
        {
          // this.toysMapService.setLocation(e.latlng.lat, e.latlng.lng);
          this.toysMapService.setLocation(e.latlng.lat, e.latlng.lng);
          console.log(this.location.latitude);
          console.log(this.location.longitude);
          close();
          }
    }
    // this.closePopUpMap();
    // this.toyGrid.reloadData();    
  }
}
