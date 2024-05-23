import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OCurrencyInputComponent, ODialogConfig, OEmailInputComponent, OFormComponent, OTextInputComponent, OTranslateService } from 'ontimize-web-ngx';
import { StripeComponent } from 'src/app/shared/components/stripe/stripe.component';

@Component({
  selector: 'app-toys-shipping',
  templateUrl: './toys-shipping.component.html',
  styleUrls: ['./toys-shipping.component.scss']
})
export class ToysShippingComponent implements OnInit{

  // El 0.1 se refiere al 10% de comisión
  public commission:number = 0.07;
  public commissionPrice:number;
  // Se contenplan 3 euros de gastos de envio
  public priceSend:number = 3;
  public issetSend:boolean = true;
  // Compañias de envio
  public dataCompany = [{
    code: 0,
    company: 'Correos'
  },]
  public defaultCompany = 0;



  private form: Element;
  @ViewChild('toyId') toyId: OTextInputComponent;
  @ViewChild('nameInput') toyName: OTextInputComponent;
  @ViewChild('emailInput') toyEmail: OEmailInputComponent;
  @ViewChild('priceInput') price: OCurrencyInputComponent;

  @ViewChild('formShipments') protected formShipments: OFormComponent;
  @ViewChild('order_id') order_id: OTextInputComponent;
  @ViewChild('onlyBuy') buyOption;
  @ViewChild('BuySend') buySendOption;
  @ViewChild('buyInfo') buyInfo;
  @ViewChild('buyButton') buyButton;
  @ViewChild('stripe') stripe: StripeComponent;

  constructor(
    private actRoute: ActivatedRoute, 
    private router: Router,
    protected dialogService: DialogService,
    private translate: OTranslateService,
  ) {
   }

   ngOnInit() {
    this.form = document.getElementById("formShipments");
   }

   showFormShipments(){
    if(this.buyOption._checked){
      this.issetSend = false;
      this.form.classList.add("hidden")
      this.buyButton.nativeElement.classList.remove("hidden")
      this.buyInfo.nativeElement.classList.remove("hidden")
    }

    if(this.buySendOption._checked){
      this.issetSend = true;
      this.form.classList.remove("hidden")
      this.buyInfo.nativeElement.classList.remove("hidden")
      this.buyButton.nativeElement.classList.add("hidden")
    }

   }

  setData(): void {

    console.log("toyId:", this.toyId.getValue());
    console.log("name:", this.toyName.getValue());
    console.log("Email:", this.toyEmail.getValue());
    console.log("price:", this.price.getValue())

    // setStripe
    this.stripe.toyId = this.toyId.getValue();
    this.stripe.product = this.toyName.getValue();
    this.stripe.email = this.toyEmail.getValue();  
    //setCalculatePrice
    this.commissionPrice = (Number)((this.price.getValue()* this.commission).toFixed(2));
    //setOrder_id
    this.order_id.setValue(this.toyId.getValue());
    console.log(this.order_id)
  }

  checkout() {
    this.stripe.ckeckout();
  }

  newSubmit() {

    let arrayErrores: any [] = [];
    const getFieldValues = this.formShipments.getFieldValues(['name','email_buyer','shipping_address','buyer_phone','company']);
    
    let errorName = "ERROR_NAME_VALIDATION";
    let errorEmail = "ERROR_EMAIL_VALIDATION";
    var regExpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
    let errorAddress = "ERROR_ADDRESS_VALIDATION";
    let errorPhone = "ERROR_PHONE_VALIDATION";
    let errorCompany = "ERROR_COMPANY_VALIDATION";

    if(getFieldValues.name === undefined || getFieldValues.name.trim() === ""){
      arrayErrores.push(this.translate.get(errorName));
    }
    if(getFieldValues.email_buyer === undefined || getFieldValues.email_buyer.trim() === "" || !regExpEmail.test(getFieldValues.email_buyer.trim())){
      arrayErrores.push(this.translate.get(errorEmail));
    }
    if(getFieldValues.shipping_address === undefined || getFieldValues.shipping_address.trim() === ""){
      arrayErrores.push(this.translate.get(errorAddress));
    }
    if(getFieldValues.buyer_phone === undefined || getFieldValues.buyer_phone.trim() === ""){
      arrayErrores.push(this.translate.get(errorPhone));
    }
    if(getFieldValues.company === undefined || getFieldValues.company){
      // getFieldValues.company = this.defaultCompany;
      arrayErrores.push(this.translate.get(errorCompany));
    }
    
    if(arrayErrores.length > 0 ) {
      let stringErrores = "";
      for(let i = 0; i < arrayErrores.length; i++){
        stringErrores += "</br>" + (arrayErrores[i] + "</br>");
      }
      this.showCustom("error", "Ok", this.translate.get("COMPLETE_FIELDS_VALIDATION"), stringErrores);
    }else{
      console.log(this.formShipments.getDataValues)
      // this.formShipments.insert();
      // this.checkout();
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

  insertRedirect(){
    this.router.navigate(["main/toys/toysDetail", this.toyId]);
  }
}
