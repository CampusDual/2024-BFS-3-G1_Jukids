import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OntimizeService } from 'ontimize-web-ngx';
import { HttpHeaders } from '@angular/common/http';
import { NumberValueAccessor } from '@angular/forms';
import { calculateDistanceFunction } from 'src/app/shared/shared.module';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private latitude: any;
  private longitude: any;

  private latitudeComprador: any = 3;
  private longitudeComprador: any = 3;

  public calculateDistance = calculateDistanceFunction;
  // public calculateDistance = calculateDistanceFunction(this.latitudeComprador, this.longitudeComprador, e);
  
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private ontimizeService: OntimizeService
  ) {
    const conf = this.ontimizeService.getDefaultServiceConfiguration('toys');
    this.ontimizeService.configureService(conf);
  }

  ngOnInit() {
  }

  navigate() {
    this.router.navigate(['../', 'login'], { relativeTo: this.actRoute });
  }


  onMapClick(e) {
    this.latitude = e.latlng.lat;
    console.log(this.latitude);
    this.longitude = e.latlng.lng
    console.log(this.longitude)

    let date: Date = new Date();

    const toy = {"data": {
      "name": "Locationontimize",
      "description": "Locationteamontimize",
      "dateadded": date.toISOString().split('T')[0],
      "price": 23.12,
      "photo": "sdad",
      "latitude": this.latitude,
      "longitude":  this.longitude

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

  deg2rad(deg:number):number {
    return deg * (Math.PI / 180);
  } 

  // calculateDistance(rowData: Array<any>):number {
  //   const R:number = 6371; // Radio de la Tierra en kilómetros
  //   const lat1:number = 42.240599;
  //   const lon1:number = -8.720727;

  //   let lat2:number = rowData['latitude'];
  //   let lon2:number = rowData['longitude'];
    
  //   let dLat:number = this.deg2rad(lat2 - lat1);
  //   let dLon:number = this.deg2rad(lon2 - lon1);
  //   let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
  //           + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2))
  //           * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   let distance = R * c;

  //   console.log(lat2-lat1);

  //   return lat2-lat1;
  //   //return Math.round(distance * 100.0) / 100.0; // Redondear a 2 decimales
  // } 
    

  getPosition(e){
    this.latitudeComprador = e.latlng.lat;
    console.log("latitudeComprador"+this.latitudeComprador);
    this.longitudeComprador = e.latlng.lng
    console.log("longitudeComprador"+this.longitudeComprador)
  }

  managerClick(e){
    this.getPosition(e);
    // this.calculateDistance = calculateDistanceFunction(this.latitudeComprador, this.longitudeComprador, e)
  }

}
