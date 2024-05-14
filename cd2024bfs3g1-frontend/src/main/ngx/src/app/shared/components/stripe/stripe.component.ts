import { Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { DialogService, OButtonComponent, ODialogConfig, OFormComponent, OntimizeService, ServiceResponse } from 'ontimize-web-ngx';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})
export class StripeComponent implements OnInit, OnDestroy {

  // ====================== Variables ======================  
  public loading: boolean = false;
  public isCheckingOut: boolean = false;

  // ====================== Stripe Variables ======================
  private checkout: StripeEmbeddedCheckout;

  // ====================== Inputs ======================
  @Input('toyId') toyId: string;
  @Input('product') product: string;
  @Input('email') email: string;
  @Input('amount') amount: number;

  // ====================== SIMPLE CARD ELEMENT ======================
  @ViewChild(StripeCardComponent) cardElement!: StripeCardComponent;
  @ViewChild('stripeForm') protected stripeForm: OFormComponent;
  @ViewChild('payButton') protected payButton: OButtonComponent;

  // ====================== Ontimize Variables ======================
  ontimizeService: OntimizeService;

  constructor(
    private stripeService: StripeService,
    protected injector: Injector,
    protected dialogService: DialogService
  ) {
    this.ontimizeService = this.injector.get(OntimizeService);
    this.configureService();
  }
  protected configureService() {
    // Configure the service using the configuration defined in the `app.services.config.ts` file
    const conf = this.ontimizeService.getDefaultServiceConfiguration('payments');
    this.ontimizeService.configureService(conf);
  }

  ngOnInit(): void {
    console.log("STRIPE TOYID:", this.toyId);
  }


  //====================== STRIPE CHECKOUT JS =======================

  ckeckout(): void {

    this.isCheckingOut = true;
    this.loading = true;

    let data = {
      'toyid': this.toyId,
      'toyUrl': 'http://localhost:4299/main/toys/toysDetail/' + this.toyId
    }

    console.log("data:", data);

    this.ontimizeService.doRequest({
      method: 'POST',
      url: 'http://localhost:8080/payments/create-checkout-session',
      body: data,
      options: {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }).subscribe({
      next: async (session: ServiceResponse) => {
        let sesiondata = JSON.parse(session.data.session);

        console.log("session:", session.data);
        console.log("sesiondata:", sesiondata);

        await this.stripeService.getInstance().initEmbeddedCheckout({
          clientSecret: sesiondata.client_secret
        }).then( (checkout: StripeEmbeddedCheckout) => {
          this.checkout = checkout;
          this.checkout.mount('#checkout');
          this.loading = false;
        }).catch((err) => {
          console.log(err);
          this.showCustom( 'error', 'OK', 'Error en embedded checkout', err.error.message);

        });



      },
      error: (err) => {
        this.showCustom( 'error', 'OK', 'Error en endpoint', err.error.message);
        console.log(err);
      }
    })

  }

  ngOnDestroy(): void {
    this.checkout.destroy();
  }

  // =============================  DIALOGS =============================

  showCustom(
    icon: string = 'info',
    btnText: string,
    dialogTitle: string,
    dialogText: string,
  ) {
    if (this.dialogService) {
      const config: ODialogConfig = {
        icon: icon,
        okButtonText: btnText
      };

      this.dialogService.alert(dialogTitle, dialogText, config);
    }
  }




}