import { Component, Inject, OnInit } from '@angular/core';
import { OntimizeService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-toys-detail',
  templateUrl: './toys-detail.component.html',
  styleUrls: ['./toys-detail.component.scss']
})
export class ToysDetailComponent{

  showCheckout = false;

  constructor(
    private ontimizeService: OntimizeService
  ) { }
  
  
  openCheckout() {
    this.showCheckout = true;
  }


}
