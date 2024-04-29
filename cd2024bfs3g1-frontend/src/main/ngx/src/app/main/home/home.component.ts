import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OntimizeService } from 'ontimize-web-ngx';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { OMapComponent } from 'ontimize-web-ngx-map';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private latitude: any;
  private longitude: any;
  private location: any;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private ontimizeService: OntimizeService,
    protected dialogService: DialogService,
    private  toysMapService: ToysMapService
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
}