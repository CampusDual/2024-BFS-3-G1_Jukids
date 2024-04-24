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

    const toy = {
      "name": "",
      "description": "",
      "dateadded": date,
      "price": 0,
      "photo": "sdad",
      "longitude": this.longitude,
      "latitude": this.latitude
    };

    console.log(toy); 
    this.ontimizeService.insert(toy, 'toy');


  }

}
