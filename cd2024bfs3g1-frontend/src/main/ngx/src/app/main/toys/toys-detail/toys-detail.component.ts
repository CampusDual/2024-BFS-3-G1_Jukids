import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OEmailInputComponent, OTextInputComponent } from 'ontimize-web-ngx';
import { StripeComponent } from 'src/app/shared/components/stripe/stripe.component';

@Component({
  selector: 'app-toys-detail',
  templateUrl: './toys-detail.component.html',
  styleUrls: ['./toys-detail.component.scss']
})
export class ToysDetailComponent {

  showCheckout = false;
  @ViewChild('toyId') toyId: OTextInputComponent;
  @ViewChild('nameInput') toyName: OTextInputComponent;
  @ViewChild('emailInput') toyEmail: OEmailInputComponent;
  @ViewChild('stripe') stripe: StripeComponent;

  constructor(private router: Router,) { }

  openBuy(toyid): void {
    this.router.navigate(["main/toys/toysDetail/toysBuy", toyid]);
  }

  setStripe(): void {

    console.log("toyId:", this.toyId.getValue());
    console.log("name:", this.toyName.getValue());
    console.log("Email:", this.toyEmail.getValue());
    

    this.stripe.toyId = this.toyId.getValue();
    this.stripe.product = this.toyName.getValue();
    this.stripe.email = this.toyEmail.getValue();    
  }


  checkout() {
    this.stripe.ckeckout();
  }

}
