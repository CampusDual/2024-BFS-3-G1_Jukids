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
  @ViewChild('tableReceived') protected tableReceived :OTableBase ;
  @ViewChild('tableConfirm') protected tableConfirm :OTableBase ;
  @ViewChild('tablePurchased') protected tablePurchased :OTableBase ;

  constructor(
    private authService: AuthService,
    private router: Router,
    //private actRoute: ActivatedRoute,
    protected dialogService: DialogService,
    private oServiceShipment: OntimizeService,
    public userInfoService: UserInfoService) {

    const conf2 = this.oServiceShipment.getDefaultServiceConfiguration('shipments');
    this.oServiceShipment.configureService(conf2);

    this.userInfo = this.userInfoService.getUserInfo();
    if (!this.authService.isLoggedIn()) {
      const self = this;
      self.router.navigate([this.redirect]);
    }
  }

  //Cambia de estado 2 a 3 y refesca las tablas de ambos estado
  public checkReceive(e){
    const kv = {"toyid": e.toyid};
    const av = {"transaction_status": this.STATUS_RECEIVED}
    this.oServiceShipment.update(kv, av, "shipmentReceived").subscribe(result => {
      this.tableReceived.refresh();
      this.tableConfirm.refresh();      
    })
  }

  //Cambia de estado 3 a 4 y refesca las tablas de ambos estado
  public checkOk(e){
    const kv = {"toyid": e.toyid};
    const av = {"transaction_status": this.STATUS_PURCHASED}    
    this.oServiceShipment.update(kv, av, "shipmentConfirmed").subscribe(result => {
      this.tableConfirm.refresh();
      this.tablePurchased.refresh();
    })
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
