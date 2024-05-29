import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DialogService, OCurrencyInputComponent, ODialogConfig, OEmailInputComponent, OFormComponent, OTextInputComponent, OTranslateService, OntimizeService } from 'ontimize-web-ngx';
import { StripeComponent } from 'src/app/shared/components/stripe/stripe.component';

@Component({
  selector: 'app-toys-shipping',
  templateUrl: './toys-shipping.component.html',
  styleUrls: ['./toys-shipping.component.scss']
})
export class ToysShippingComponent implements OnInit {

  // El 0.1 se refiere al 10% de comisión
  public commission: number = 0.07;
  public warrantyPrice: number;
  // Se contenplan 3 euros de gastos de envio
  public priceSend: number = 3.00;
  public issetSend: boolean = true;
  // Compañias de envio
  public dataCompany = [{
    code: 'Correos',
    company: 'Correos'
  },
  {
    code: 'MRW',
    company: 'MRW'
  },
  {
    code: 'Nacex',
    company: 'Nacex'
  }]
  public defaultCompany = 'Correos';

  //Usuario loggedaro
  public logged: boolean = false;

  private form: Element;
  @ViewChild('toyId') toyId: OTextInputComponent;
  @ViewChild('nameInput') toyName: OTextInputComponent;
  @ViewChild('shippingInput') shippingInput: OTextInputComponent;
  @ViewChild('emailInput') toyEmail: OEmailInputComponent;
  @ViewChild('priceInput') priceToy: OCurrencyInputComponent;
  @ViewChild('formShipments') formShipments: OFormComponent;
  @ViewChild('orderId') order_id: OTextInputComponent;
  @ViewChild('price') price: OTextInputComponent;
  // @ViewChild('name') name: OTextInputComponent;
  // @ViewChild('shippingAddress') address;
  // @ViewChild('buyerPhone') phone;
  // @ViewChild('shipmentCompany') company;
  @ViewChild('onlyBuy') buyOption;
  @ViewChild('BuySend') buySendOption;
  @ViewChild('buyInfo') buyInfo;
  @ViewChild('buyButton') buyButton;
  @ViewChild('emailForm') emailForm;
  @ViewChild('buyerEmail') protected buyerEmail: OTextInputComponent;
  @ViewChild('buttonAcceptPay') AcceptPayButton;
  @ViewChild('stripe') stripe: StripeComponent;

  @ViewChild('buy') buy: any;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    protected dialogService: DialogService,
    private translate: OTranslateService,
    private authService: AuthService,
    private oServiceToy: OntimizeService,
    private oServiceOrder: OntimizeService,
  ) {
    this.logged = this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.form = document.getElementById("formShipments");

    const conf2 = this.oServiceOrder.getDefaultServiceConfiguration('orders');
    this.oServiceOrder.configureService(conf2);

  }

  showFormShipments() {
    if (this.buyOption._checked) {
      this.issetSend = false;
      this.form.classList.add("hidden")
      this.buyButton.nativeElement.classList.remove("hidden")
      this.buyInfo.nativeElement.classList.remove("hidden")
      this.emailForm.nativeElement.classList.add("hidden")
    }

    if (this.buySendOption._checked) {
      this.issetSend = true;
      this.form.classList.remove("hidden")
      this.buyInfo.nativeElement.classList.remove("hidden")
      this.emailForm.nativeElement.classList.add("hidden")
      this.buyButton.nativeElement.classList.add("hidden")
    }

  }

  setData(): void {
    console.log("toyId:", this.toyId.getValue());
    console.log("name:", this.toyName.getValue());
    console.log("Email:", this.toyEmail.getValue());
    console.log("price:", this.priceToy.getValue());
    console.log("shippingInput:", this.shippingInput.getValue());

    // setStripe
    this.stripe.toyId = this.toyId.getValue();
    this.stripe.product = this.toyName.getValue();
    this.stripe.email = this.toyEmail.getValue();
    //setCalculatePrice
    this.warrantyPrice = (Number)((this.priceToy.getValue() * this.commission).toFixed(2));
    //setOrder_id
    this.order_id.setValue(this.toyId.getValue());
    //setPriceSend
    this.price.setValue(this.priceSend);

    //Formulario de envio desabilitado
    if (!this.shippingInput.getValue()) {
      console.log("no envio")
      this.issetSend = false;
      this.form.classList.add("hidden")
      this.buyButton.nativeElement.classList.remove("hidden")
      this.buyInfo.nativeElement.classList.remove("hidden")
      this.emailForm.nativeElement.classList.add("hidden")
    }
    //disabled !logged
    if (!this.logged) {
      this.AcceptPayButton.nativeElement.classList.add("hidden")
    }
    if (!this.shippingInput.getValue()) {
      console.log("no envio")
      this.issetSend = false;
      this.form.classList.add("hidden")
      this.buyButton.nativeElement.classList.remove("hidden")
      this.buyInfo.nativeElement.classList.remove("hidden")
      this.emailForm.nativeElement.classList.add("hidden")
    }
  }

  checkout() {
    this.stripe.ckeckout();
  }
  newBuy() {
    //Comentarios de este metodo pra logeado
    if (!this.logged) {
      this.buyButton.nativeElement.classList.add("hidden")
      this.emailForm.nativeElement.classList.remove("hidden")
    } else {
      console.log(this.toyId.getValue())
      const avOrder = { "toyid": this.toyId.getValue() }
      this.oServiceOrder.insert(avOrder, "order").subscribe(result => {
      })
      this.checkout();
    }
  }

  paySubmit() {
    const conf = this.oServiceToy.getDefaultServiceConfiguration('toys');
    this.oServiceToy.configureService(conf);

    const av = { "toyid": this.toyId.getValue(), "buyer_email": this.buyerEmail.getValue() }
    this.oServiceToy.insert(av, "order").subscribe(result => {
    })
    this.checkout();
  }

  newSubmit() {

    let arrayErrores: any[] = [];

    const getFieldValues = this.formShipments.getFieldValues(['order_id', 'price', 'shipping_address', 'buyer_phone', 'shipment_company']);
    console.log(getFieldValues)

    let errorName = "ERROR_NAME_VALIDATION";
    let errorEmail = "ERROR_EMAIL_VALIDATION";
    var regExpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
    let errorAddress = "ERROR_ADDRESS_VALIDATION";
    let errorPhone = "ERROR_PHONE_VALIDATION";
    let errorCompany = "ERROR_COMPANY_VALIDATION";

    // if(getFieldValues.name === undefined || getFieldValues.name.trim() === ""){
    //   arrayErrores.push(this.translate.get(errorName));
    // }
    // if(getFieldValues.email_buyer === undefined || getFieldValues.email_buyer.trim() === "" || !regExpEmail.test(getFieldValues.email_buyer.trim())){
    //   arrayErrores.push(this.translate.get(errorEmail));
    // }
    if (getFieldValues.shipping_address === undefined || getFieldValues.shipping_address.trim() === "") {
      arrayErrores.push(this.translate.get(errorAddress));
    }
    if (getFieldValues.buyer_phone === undefined || getFieldValues.buyer_phone.trim() === "") {
      arrayErrores.push(this.translate.get(errorPhone));
    }
    if (getFieldValues.shipment_company === undefined) {
      // getFieldValues.company = this.defaultCompany;
      arrayErrores.push(this.translate.get(errorCompany));
    }

    if (arrayErrores.length > 0) {
      let stringErrores = "";
      for (let i = 0; i < arrayErrores.length; i++) {
        stringErrores += "</br>" + (arrayErrores[i] + "</br>");
      }
      this.showCustom("error", "Ok", this.translate.get("COMPLETE_FIELDS_VALIDATION"), stringErrores);
    } else {
      this.formShipments.insert();
      this.checkout();
    }

  }


  showCustom(
    icon: string,
    btnText: string,
    dialogTitle: string,
    dialogText: string,
  ) {
    if (this.dialogService) {
      const config: ODialogConfig = {
        icon: icon,
        okButtonText: btnText
      };
      this.dialogService.info(dialogTitle, dialogText, config);
    }
  }

  insertRedirect() {
    this.router.navigate(["main/toys/toysDetail", this.toyId]);
  }
}
