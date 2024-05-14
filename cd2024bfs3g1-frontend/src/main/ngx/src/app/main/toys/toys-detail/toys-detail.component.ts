import { AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, OnChanges, OnInit, ViewChild } from '@angular/core';
import { OEmailInputComponent, OFormComponent, OIntegerInputComponent, OTextInputComponent, OntimizeService } from 'ontimize-web-ngx';
import { StripeComponent } from 'src/app/shared/components/stripe/stripe.component';

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
  @ViewChild('stripe') stripe: StripeComponent;

  protected stripeToyId: string;
  protected stripeToyProduct: string;
  protected stripeToyEmail: string;
  protected stripeToyPrice: number;


  constructor() { }


  setStripe(): void {
    this.stripe.toyId = this.toyId.getValue();
    this.stripe.product = this.toyName.getValue();
    this.stripe.email = this.toyEmail.getValue();
    this.stripe.amount = parseFloat(this.toyPrice.getValue());
  }

}
