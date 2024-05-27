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
  @ViewChild('toyId') toyId: OTextInputComponent;
  @ViewChild('transactionStatus') transactionStatus: OTextInputComponent;
  @ViewChild('tableToy') protected tableToy :any ;
  @ViewChild('tableReceived') protected tableReceived :OTableBase ;

  constructor(
    private authService: AuthService,
    private router: Router,
    protected dialogService: DialogService,
    private translate: OTranslateService,
    private oServiceToyownwer: OntimizeService,
    private oServiceShipment: OntimizeService,
    public userInfoService: UserInfoService) {

    const conf = this.oServiceToyownwer.getDefaultServiceConfiguration('toyowner');
    this.oServiceToyownwer.configureService(conf);

    const conf2 = this.oServiceShipment.getDefaultServiceConfiguration('shipments');
    this.oServiceShipment.configureService(conf2);


    this.userInfo = this.userInfoService.getUserInfo();
    if (!this.authService.isLoggedIn()) {
      const self = this;
      self.router.navigate([this.redirect]);
    }
  }


  public checkReceive(e){
    console.log("######################################")
    console.log(e)
    console.log(e.toyid)
    console.log("######################################")
    const kv = {"toyid": e.toyid};
    const av = {"transaction_status": this.STATUS_RECEIVED}
    // this.oServiceToyownwer.update(kv, av, "toySimple").subscribe(result => {
    //   console.log(result);
    // })
    this.oServiceShipment.update(kv, av, "shipmentReceived").subscribe(result => {
      console.log(result);
      this.tableReceived.refresh();
    })
  }

  public checkOk(e){


    console.log("######################################")
    console.log(e)
    console.log(e.toyid)
    console.log("######################################")
    const kv = {"toyid": e.toyid};
    const av = {"transaction_status": this.STATUS_PURCHASED}
    // TODO: Cambiar entidad
    alert("OJO!! Falta actión de boton (pasar a estado 4)")
    // this.oServiceShipment.update(kv, av, "shipmentReceived").subscribe(result => {
    //   console.log(result);
    //   this.tableReceived.refresh();
    // })
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
