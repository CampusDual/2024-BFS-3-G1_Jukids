import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { StripeCardElementOptions, StripeElementsOptions, PaymentIntent } from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { DialogService, OButtonComponent, ODialogConfig, OFormComponent, Observable, OntimizeService, ServiceResponse } from 'ontimize-web-ngx';
import { PaymentIntentDto } from './dto/payment-intent-dto';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit {

  // ====================== Variables ======================
  public loading: boolean = false;

  // ====================== Inputs ======================
  @Input('toyId') toyId: string;
  @Input('product') product: string;
  @Input('email') email: string;
  @Input('amount') amount: number;



  // ====================== SIMPLE CARD ELEMENT ======================
  @ViewChild(StripeCardComponent) cardElement!: StripeCardComponent;
  @ViewChild('stripeForm') protected stripeForm: OFormComponent;
  @ViewChild('payButton') protected payButton: OButtonComponent;

  cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#666EE8',
        backgroundColor: '#F5F5F5',
        color: '#31325F',
        lineHeight: '40px',
        padding: '5px',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

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

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  //====================== STRIPE JS =======================

  pay() {

    let cardState = this.cardElement.stripeElementRef.nativeElement.classList;

    // console.log(this.cardElement.stripeElementRef.nativeElement);
    // console.log(cardState.contains("StripeElement--complete"));

    if (cardState.contains("StripeElement--complete")) {

      this.loading = true;
      this.payButton.enabled = false;


      let name = this.stripeForm.getFieldValue('product');
      let amount = this.stripeForm.getFieldValue('amount');



      let tokenCardID: string;

      //Inicio del pago con stripe
      this.stripeService.createToken(this.cardElement.element, { name })
        .subscribe({
          next: (result) => {
            //Resultado de la generacion del token en la tarjeta
            if (result.token) {

              console.log("Card gen result:", result);


              tokenCardID = result.token.card.id;

              // Generacion del objeto para el pago
              let paymentIntentObject: PaymentIntentDto = {
                // token: result.token.id,
                description: name,
                amount: (amount * 100),
                currency: 'EUR'
              }

              console.log("paymentIntentObject:", paymentIntentObject);

              // Parseo del json a String con Stringify object
              let strJson = JSON.stringify(paymentIntentObject)

              try {

                // Llamada al servicio de pago - Payment Intent
                this.ontimizeService.doRequest({
                  method: 'POST',
                  url: 'http://localhost:8080/payments/paymentIntent',
                  body: strJson,
                  options: {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }
                }).subscribe({

                  //Si es correcto obtenemos la respuesta
                  next: (resp: ServiceResponse) => {

                    console.log(resp)

                    let payment = JSON.parse(resp.data.payment)

                    console.log("payment", payment);
                    console.log("payment ID", payment.id);

                    //Al obtener la respuesta del servidor procedemos a confirmar el pago o cancelarlo
                    this.dialogService.confirm('Confirmación de pago', 'Desea realizar la compra?', {
                      okButtonText: 'Confirmar', cancelButtonText: 'Cancelar',
                    }).then((result) => {

                      //=================== CONFIRMAR PAGO =====================

                      //Si el usuario confirma el pago en la ventana de dialogo.
                      if (result === true) {

                        //Se realiza la confirmacion del pago con el endpont - Payment Intent Confirm
                        this.ontimizeService.doRequest({
                          method: 'POST',
                          url: `http://localhost:8080/payments/confirm/${payment.id}`,
                          body: { token: tokenCardID },
                          options: {
                            headers: {
                              'Content-Type': 'application/json'
                            }
                          }
                        }).subscribe({

                          //Si es correcto obtenemos lanzamos ventana de success
                          next: (resp: ServiceResponse) => {
                            this.showCustom("verified", "Cerrar", "Payment Intent Confirmation Success", "Pago realizado!");
                            this.loading = false;
                          },

                          //Si hay un error lanzamos ventana de error
                          error: (err) => {
                            console.log("Payment Intent Confirmation ERROR:", err);
                            this.showCustom("report", "Cerrar", "Payment Intent Confirmation Error", "Error al realizar el pago");
                            this.loading = false;
                          }
                        });


                      } else {

                        //=================== CANCELAR PAGO =====================

                        this.ontimizeService.doRequest({
                          method: 'POST',
                          url: `http://localhost:8080/payments/cancel/${payment.id}`,
                          options: {
                            headers: {
                              'Content-Type': 'application/json'
                            }
                          }
                        }).subscribe({
                          next: (resp: ServiceResponse) => {
                            console.log("Payment Intent Cancel:", resp);
                            this.showCustom("report", "Cerrar", "Payment Intent Cancelled", "El pago fue cancelado");
                            this.loading = false;

                          },
                          error: (err) => {
                            console.log("Payment Intent Cancel ERROR:", err);
                            this.loading = false;
                          }
                        });
                        //Si el usuario cancela el pago, por el momento una ventana de aviso. Falta Logica futura

                      }

                    });

                    //Error del payment intent
                  }, error: (err) => {

                    this.showCustom("report", "Cerrar", "Payment Intent Error", "Error al realizar el pago");
                    this.loading = false;
                  }
                })

              } catch (error) {

                console.log("error:", error);
              }

            }
          },

          error: (err) => {
            this.showCustom("report", "Cerrar", "Payment Intent Error", err.message);
            this.loading = false;
          }
        });

    }



    // 


    //   this.paymentService.pagar(paymentIntentDto).subscribe(
    //     data => {
    //       this.abrirModal(data[`id`], this.nombre, data[`description`], data[`amount`]);
    //       this.router.navigate(['/']);
    //     }
    //   );
    //   this.error = undefined;
    // } else if (result.error) {
    //   this.error = result.error.message;
    // }




    // console.log("name", name);
  }


  //====================== STRIPE CHECKOUT JS =======================

  ckeckout(): void {

    // this.ontimizeService.doRequest({
    //   method: 'POST',
    //   url: 'http://localhost:8080/payments/create-checkout-session',
    //   options: {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // }).pipe(
    //   switchMap(session => {
    //     return this.stripeService.redirectToCheckout({ sessionId: session.id })
    //   })
    // ).subscribe({
    //   next: (result) => {
    //     console.log(result);
    //   },
    //   error: (err) => { 

    //   }
    // })



  }




  // pay(): void {

  //   console.log( "CardElement:", this.cardElement.element);


  //   this.createPaymentIntent(this.stripeTest.get('amount').value)
  //       .pipe(
  //         switchMap((pi) =>
  //           this.stripeService.confirmCardPayment(pi.client_secret, {
  //             payment_method: {
  //               card: this.cardElement.element,
  //               billing_details: {
  //                 name: this.stripeTest.get('name').value,
  //               },
  //             },
  //           })
  //         )
  //       )
  //       .subscribe((result) => {
  //         if (result.error) {
  //           // Show error to your customer (e.g., insufficient funds)
  //           console.log(result.error.message);
  //         } else {
  //           // The payment has been processed!
  //           if (result.paymentIntent.status === 'succeeded') {
  //             // Show a success message to your customer
  //           }
  //         }
  //       });

  // }

  // createPaymentIntent(amount: number): Observable<PaymentIntent> {

  //   return this.http.post<PaymentIntent>(
  //     `${env.apiUrl}/create-payment-intent`,
  //     { amount }
  //   );
  // }









  // ====================== STRIPE SIMPLE TOKENPK CARD ======================
  // Replace with your own public key
  // stripe = injectStripe("pk_test_51PBat3RpYL4S8tgEy69BoMSpHv1UraxL3lY3CYurMK5mx3InDvRCbu6Uzf9SxAz08C1V2Lr6K1gR7eYJSORYQxE600WVFUPXcv");

  // createToken() {

  //   // console.log("stripeForm: ", this.stripeForm.getFieldValues(['product', 'email']));
  //   let name = this.stripeForm.getFieldValues(['product']).product;
  //   let email = this.stripeForm.getFieldValues(['email']);
  //   let amount:number = parseInt(this.stripeForm.getFieldValues(['amount']).amount);

  //   console.log("Product: ", name);
  //   this.stripe
  //   .createToken(this.cardElement.element, { name })
  //   .subscribe((result) => {
  //     if (result.token) {
  //       console.log(result.token);
  //       // Use the token
  //       console.log(result.token.id);
  //     } else if (result.error) {
  //       // Error creating the token
  //       console.log(result.error.message);
  //     }
  //   });

  // this.stripe
  //   .createToken(this.cardElement.element, { name: product, currency: 'eur' })
  //   .subscribe((result) => {
  //     if (result.token) {
  //       // Use the token
  //       console.log(result.token);
  //       console.log(result.token.id);
  //     } else if (result.error) {
  //       // Error creating the token
  //       console.log(result.error.message);
  //     }
  //   });
  // }


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