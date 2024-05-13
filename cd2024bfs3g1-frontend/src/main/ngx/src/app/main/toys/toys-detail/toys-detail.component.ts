import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { OEmailInputComponent, OFormComponent, OIntegerInputComponent, OTextInputComponent, OntimizeService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-toys-detail',
  templateUrl: './toys-detail.component.html',
  styleUrls: ['./toys-detail.component.scss']
})
export class ToysDetailComponent {

  showCheckout = false;
  @ViewChild('toyId') toyId: OTextInputComponent;
  @ViewChild('toyName') toyName: OTextInputComponent;
  @ViewChild('toyEmail') toyEmail: OEmailInputComponent;
  @ViewChild('toyPrice') toyPrice: OTextInputComponent;

  protected stripeToyId: string;
  protected stripeToyProduct: string;
  protected stripeToyEmail: string;
  protected stripeToyPrice: number;


  constructor() { }


  openCheckout() {

    this.stripeToyId = this.toyId.getValue();
    this.stripeToyProduct = this.toyName.getValue();
    this.stripeToyEmail = this.toyEmail.getValue();
    this.stripeToyPrice = parseFloat(this.toyPrice.getValue());

    console.log( "this.stripeToyId: " + this.stripeToyId );

    this.showCheckout = true;
  }


}
