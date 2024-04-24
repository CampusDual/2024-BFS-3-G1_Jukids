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

}
