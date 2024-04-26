import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OntimizeService } from 'ontimize-web-ngx';
import { HttpHeaders } from '@angular/common/http';
import { NumberValueAccessor } from '@angular/forms';
import { calculateDistanceFunction } from 'src/app/shared/shared.module';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { OMapComponent } from 'ontimize-web-ngx-map';
import { OMapLayerComponent } from 'ontimize-web-ngx-map';
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
    console.log(this.latitude);
    this.longitude = e.latlng.lng
    console.log(this.longitude)

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

    /* const headers = new HttpHeaders({
       'Authorization': 'Basic ' + btoa('admin:adminuser')
     });

     const basicauth = { headers: headers };

     console.log(toy);
     this.ontimizeService.insert(toy, 'toy',basicauth).subscribe(
       (Response)=>{
         console.log('Insertado');
     },
     (Error) =>{
       console.error('Error');

     }

   );*/


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
