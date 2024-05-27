import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, DialogService, ODialogConfig, OFormComponent, OTableBase, OTextInputComponent, OTranslateService, OntimizeService } from 'ontimize-web-ngx';
import { UserInfoService } from 'src/app/shared/services/user-info.service';

@Component({
  selector: 'app-user-profile-buylist',
  templateUrl: './user-profile-buylist.component.html',
  styleUrls: ['./user-profile-buylist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class UserPurchasedToylistComponent {
  public userInfo;
  private redirect = '/toys';

  //Constantes de estado de toy
  private STATUS_AVAILABLE:Number  = 0;
  private STATUS_PENDING_SHIPMENT: Number = 1;
  private STATUS_SENT: Number = 2;
  private STATUS_RECEIVED: Number = 3;
  private STATUS_PURCHASED: Number = 4;


  private status = true;
  @ViewChild('formToy') protected formReceived: OFormComponent;
  @ViewChild('tableToy') protected tableToy :any ;
  @ViewChild('toyId') toyId: OTextInputComponent;
  @ViewChild('transactionStatus') transactionStatus: OTextInputComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    protected dialogService: DialogService,
    private translate: OTranslateService,
    private oServiceToyownwer: OntimizeService,
    public userInfoService: UserInfoService) {

    const conf = this.oServiceToyownwer.getDefaultServiceConfiguration('toyowner');
    this.oServiceToyownwer.configureService(conf);


    this.userInfo = this.userInfoService.getUserInfo();
    if (!this.authService.isLoggedIn()) {
      const self = this;
      self.router.navigate([this.redirect]);
    }
  }


  public recibido(e){
    console.log(e)
    const kv = {"toyid": e.toyid};
    const av = {
      data:{
        "transaction_status": this.STATUS_RECEIVED
      }
    }
    this.oServiceToyownwer.update(kv, av, "toySimple")
  }









  public checkReceived(e: any): void {
    console.log(e)
    this.toyId.setValue(e.toyid);
    console.log(this.formReceived)
    console.log(this.tableToy)
    
    if (e.transaction_status == this.STATUS_AVAILABLE) {
      this.transactionStatus.setValue(this.STATUS_RECEIVED)
       
      this.formReceived.update();


    //   const getFieldValues = this.formReceived.getFieldValues(['toyid', 'name', 'transaction_status']);
    //   console.log(getFieldValues);

    //   this.formReceived.update()
    //   // if (this.status) {
    //   //   this.showCustom("send", "Ok", "RECIBIDO", "El juguete ha sido marcado como recibido");
    //   //   //this.showCustom("send", "Ok", this.translate.get("COMPLETE_FIELDS_VALIDATION"), "El juguete ha sido marcado como recibido");
    //   // }

    } else {
      this.showCustom("error", "Ok", "ERROR", "El juguete no puede ser marcado como recibido");
    }
  }

  public checkOk(e: any): void {

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
  
}
