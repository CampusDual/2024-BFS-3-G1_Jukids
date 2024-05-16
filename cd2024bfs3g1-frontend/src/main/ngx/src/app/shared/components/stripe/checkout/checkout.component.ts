import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OTranslatePipe, OTranslateService } from 'ontimize-web-ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  protected PAYMENT_SUCCESS: string;
  protected DONT_HESITATE: string;
  protected THANK_YOU_PURCHASE: string;
  protected TOY_BUTTON: string;



  constructor(
    private actRoute: ActivatedRoute,
    private translateService: OTranslateService,
    private router: Router
  ) {


  //   this.actRoute.queryParams.subscribe({
  //     next: (params) => {
  //       console.log( "params: ", params );
  //     }
  //   });

  }

  ngOnInit(): void {
    this.THANK_YOU_PURCHASE = this.translateService.get("THANK_YOU_PURCHASE");
    this.PAYMENT_SUCCESS = this.translateService.get("PAYMENT_SUCCESS");
    this.DONT_HESITATE = this.translateService.get("DONT_HESITATE");
    this.TOY_BUTTON = this.translateService.get('TOY_BUTTON');
  }





  /*
  REFERENCIA

    initialize();

    async function initialize() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');


      // ================  GENERAR ENDPOINT EN BACK PARA RECUPERAR ESTADO DE SESSION ================
      const response = await fetch(`/session-status?session_id=${sessionId}`);

      const session = await response.json();

      if (session.status == 'open') {


        // ================Esto no seria necesario si esta en embedded. ================
        window.replace('http://localhost:4242/checkout.html')
      } else if (session.status == 'complete') {

        //   ================Al completarse el checkout se pondria la info aqui================
        //   ================Ya sea un diseño ocutlo y mostrarlo si es complete, y sino mostrar otra cosa.================
        document.getElementById('success').classList.remove('hidden');
        document.getElementById('customer-email').textContent = session.customer_email
      }
    }

  */
    redirect(): void {
      this.router.navigate(["/"], {replaceUrl: true});
    }



}
