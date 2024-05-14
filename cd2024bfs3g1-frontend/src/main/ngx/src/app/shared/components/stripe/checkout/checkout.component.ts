import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {



  constructor( 
    private actRoute: ActivatedRoute,
  ) {


    this.actRoute.queryParams.subscribe({
      next: (params) => {
        console.log( "params: ", params );
      }
    });
    
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




}
