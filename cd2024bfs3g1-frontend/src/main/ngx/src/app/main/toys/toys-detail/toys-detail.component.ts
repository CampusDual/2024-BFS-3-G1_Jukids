import { Component, OnInit, ViewChild } from '@angular/core';
import { OEmailInputComponent, OTextInputComponent } from 'ontimize-web-ngx';
import { OMapComponent } from 'ontimize-web-ngx-map';
import { StripeComponent } from 'src/app/shared/components/stripe/stripe.component';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';

@Component({
  selector: 'app-toys-detail',
  templateUrl: './toys-detail.component.html',
  styleUrls: ['./toys-detail.component.scss']
})
export class ToysDetailComponent implements OnInit{

  private location: any;
  showCheckout = false;

  @ViewChild('toyId') toyId: OTextInputComponent;
  @ViewChild('usr_id') usr_id: OTextInputComponent;
  @ViewChild('nameInput') toyName: OTextInputComponent;
  @ViewChild('emailInput') toyEmail: OEmailInputComponent;
  @ViewChild('shipping') shipping: OTextInputComponent;
  @ViewChild('latitude') lat: OTextInputComponent;
  @ViewChild('longitude') lon: OTextInputComponent;
  @ViewChild('LocationMap') oMapBasic: OMapComponent;
  @ViewChild('statusInput') toyStatus: OTextInputComponent;
  @ViewChild('stripe') stripe: StripeComponent;

  constructor(
    private toysMapService: ToysMapService,
  ) {}

  ngOnInit() {
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    });
  }

  showMeMore() {
    console.log(this.usr_id.getValue());
  }
  onFormDataLoaded(data: any) {
    this.toysMapService.setLocation(this.lat.getValue(), this.lon.getValue())
    this.setStripe();
  }

  setStripe(): void {
    // console.log("toyId:", this.toyId.getValue());
    // console.log("name:", this.toyName.getValue());
    // console.log("Email:", this.toyEmail.getValue());
    this.stripe.toyId = this.toyId.getValue();
    this.stripe.product = this.toyName.getValue();
    this.stripe.email = this.toyEmail.getValue();
  }

  checkout() {
    this.stripe.ckeckout();
  }
}
