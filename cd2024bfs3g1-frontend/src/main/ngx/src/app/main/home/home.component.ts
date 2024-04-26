import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OntimizeService } from 'ontimize-web-ngx';
import { HttpHeaders } from '@angular/common/http';
import { NumberValueAccessor } from '@angular/forms';
import { calculateDistanceFunction } from 'src/app/shared/shared.module';
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

  private latitudeComprador: any = 42.240599;
  private longitudeComprador: any = -8.713697;

  private location;

  // public calculateDistance = calculateDistanceFunction;
  // public calculateDistance = calculateDistanceFunction(this.latitudeComprador, this.longitudeComprador, e);

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private ontimizeService: OntimizeService,
    protected dialogService: DialogService,
    private  toysMapService: ToysMapService
  ) {
    const conf = this.ontimizeService.getDefaultServiceConfiguration('toys');
    this.ontimizeService.configureService(conf);
    this.latitudeComprador = 42.240599;
    this.longitudeComprador = -8.713697;

  }

  ngOnInit() {
    this.toysMapService.location.subscribe(data => {
      this.location = data;
    });
  }

  navigate() {
    this.router.navigate(['../', 'login'], { relativeTo: this.actRoute });
  }

  @ViewChild('oMapBasic') oMapBasic: OMapComponent;

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

          console.log(this.location.latitude);
          }
    }

  }

  managerClick(e) {
    this.getPosition(e);
    // this.calculateDistance = calculateDistanceFunction(this.latitudeComprador, this.longitudeComprador, e)
  }

  calculateDistance(rowData: Array<any>){
    let latComprador = 42.240599;
    let longComprador = -8.713697;

    return calculateDistanceFunction(this.latitudeComprador, this.longitudeComprador, rowData);
  }





  // calculateDistance(rowData: Array<any>): number {
  //   const R: number = 6371; // Radio de la Tierra en kilómetros
  //   let lat1: number = this.latitudeComprador;
  //   let lon1: number = this.longitudeComprador;

  //   let lat2: number = rowData['latitude'];
  //   let lon2: number = rowData['longitude'];

  //   function deg2rad(deg: number): number {
  //     return deg * (Math.PI / 180);
  //   }

  //   let dLat: number = deg2rad(lat2 - lat1);
  //   let dLon: number = deg2rad(lon2 - lon1);
  //   let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
  //     + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
  //     * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   let distance = R * c;
  //   return Math.round(distance * 100.0) / 100.0; // Redondear a 2 decimales
  // }


}
