import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OTranslateService, OntimizeService } from 'ontimize-web-ngx';

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
  @Input('toyId') toyId: string;
  
  constructor(
    private actRoute: ActivatedRoute,
    private translateService: OTranslateService,
    private oService: OntimizeService,
    private router: Router
  ) {

    this.actRoute.queryParams.subscribe({
      next: (params) => {
        console.log("params id : ", params.session_id);
        const kv = { "toyid": this.toyId };
        const av = { "session_id": params.session_id };
        this.configureUpdateService();
        this.oService.update(kv, av, "sessionStatus").subscribe({
          next: (response) => {
            console.log('Response from sessionStatusUpdate:', response);
          },
          error: (error) => {
            console.error('Error calling sessionStatusUpdate:', error);
          }
        });
      }
    });
  }

  public configureUpdateService() {
    const paymentsConf = this.oService.getDefaultServiceConfiguration('payments');
    this.oService.configureService(paymentsConf);
  }

  ngOnInit(): void {
    this.THANK_YOU_PURCHASE = this.translateService.get("THANK_YOU_PURCHASE");
    this.PAYMENT_SUCCESS = this.translateService.get("PAYMENT_SUCCESS");
    this.DONT_HESITATE = this.translateService.get("DONT_HESITATE");
    this.TOY_BUTTON = this.translateService.get('TOY_BUTTON');
  }

  redirect(): void {
    this.router.navigate(["/"], {replaceUrl: true});
  }
}
