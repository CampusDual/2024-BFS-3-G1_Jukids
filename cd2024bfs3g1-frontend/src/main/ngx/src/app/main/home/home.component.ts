import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OntimizeService } from 'ontimize-web-ngx';

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
      "name": "Location",
      "description": "Locationteam",
      "dateadded": "2024-04-24",
      "price": 23.12,
      "photo": "sdad",
      "longitude":  -8.7226400,
      "latitude": 42.2328200
    }
    }; 

   

    console.log(toy); 
   // this.ontimizeService.insert(toy, 'toy');

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
