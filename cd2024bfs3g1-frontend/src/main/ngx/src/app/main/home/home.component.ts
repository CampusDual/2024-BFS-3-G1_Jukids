import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OntimizeService } from 'ontimize-web-ngx';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private latitude: any;
  private longitude: any;

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

/*   function deg2rad(deg:number) {
    return deg * (Math.PI / 180);
  }

  calculateDistanceFunction(lat1:number, lon1:number, lat2:number, lon2:number) {
    const R:number = 6371; // Radio de la Tierra en kilómetros
    let dLat:number = deg2rad(lat2 - lat1);
    let dLon:number = deg2rad(lon2 - lon1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
            * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;
    return Math.round(distance * 100.0) / 100.0; // Redondear a 2 decimales
  } */
  
/*    deg2rad(deg:number) {
    return deg * (Math.PI / 180);
  } */


/*   calculateBenefit(rowData: any[]): number {

    return (rowData['BALANCE'] * rowData['INTERESRATE']);
  }
 */

}
