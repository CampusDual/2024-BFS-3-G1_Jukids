import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, OTableBase, OTextInputComponent, OntimizeService } from 'ontimize-web-ngx';
import { UserInfoService } from 'src/app/shared/services/user-info.service';

@Component({
  selector: 'app-user-profile-toylist',
  templateUrl: './user-profile-toylist.component.html',
  styleUrls: ['./user-profile-toylist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class UserProfileToylistComponent {
  private STATUS_AVAILABLE: Number = 0;
  private STATUS_PENDING_SHIPMENT: Number = 1;
  private STATUS_SENT: Number = 2;
  private STATUS_RECEIVED: Number = 3;
  private STATUS_PURCHASED: Number = 4;

  @ViewChild('tableSend') protected tableSend :OTableBase ;
  @ViewChild('senderAddress') protected senderAddress :OTextInputComponent;

  public userInfo;
  private redirect = '/toys';

  constructor(
    private authService: AuthService,
    private router: Router,
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

  public openToyEdit(e: any): void {
    console.log(e.toyid);
    this.router.navigate(["/main/user-profile/edit-toy", e.toyid]);
  }

  public sendSubmit(e) {
    console.log("toyid sendSubmit:", e)
    console.log("toyid sendSubmit:", this.senderAddress.getValue())
    const kv = { "toyid": e };
    const av = { "sender_address": this.senderAddress.getValue(),"transaction_status": this.STATUS_SENT }
    this.oServiceShipment.update(kv, av, "shipmentSent").subscribe(result => {
      this.tableSend.refresh();
    })
  }

}
