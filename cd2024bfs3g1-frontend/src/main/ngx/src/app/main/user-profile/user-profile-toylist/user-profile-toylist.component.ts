import { ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JukidsAuthService } from 'src/app/shared/services/jukids-auth.service';
import { OTableBase, OTableColumnComponent, OTextInputComponent, OntimizeService } from 'ontimize-web-ngx';
import { UserInfoService } from 'src/app/shared/services/user-info.service';

@Component({
  selector: 'app-user-profile-toylist',
  templateUrl: './user-profile-toylist.component.html',
  styleUrls: ['./user-profile-toylist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class UserProfileToylistComponent implements OnInit{
  private STATUS_AVAILABLE: Number = 0;
  private STATUS_PENDING_SHIPMENT: Number = 1;
  private STATUS_SENT: Number = 2;
  private STATUS_RECEIVED: Number = 3;
  private STATUS_PURCHASED: Number = 4;
  infoToysSold: string;

  @ViewChild('tableSend') protected tableSend :OTableBase ;
  @ViewChild('senderAddress') protected senderAddress :OTextInputComponent;

  public userInfo;
  private redirect = '/toys';

  constructor(
    private jukidsAuthService: JukidsAuthService,
    private router: Router,
    private oService: OntimizeService,
    public userInfoService: UserInfoService,
    protected injector: Injector) {

    this.userInfo = this.userInfoService.getUserInfo();
    if (!this.jukidsAuthService.isLoggedIn()) {
      const self = this;
      self.router.navigate([this.redirect]);
    }
  }

  ngOnInit(): void {

    const filter = {
      usr_id: this.userInfo.usr_id
    }

    const columns = ["price"];

    this.configureToyService();
    this.oService
      .query(filter, columns, "sumPriceToysSold")
      .subscribe({
        next: (resp:any) => {      
          if (resp.code === 0 && resp.data.length > 0) {
            this.infoToysSold = resp.data[0].price.toFixed(1) + " €";
          } else {
            this.infoToysSold = "0 €";
          }
        }
      });
  }

  public configureToyService(){

    const toysConf = this.oService.getDefaultServiceConfiguration('toys');
    this.oService.configureService(toysConf);
  
  }

  public configureShipmentService(){

    const ShipmentsConf = this.oService.getDefaultServiceConfiguration('shipments');
    this.oService.configureService(ShipmentsConf);
  
  }

  public sendSubmit(e) {
    const kv = { "toyid": e };
    const av = { "sender_address": this.senderAddress.getValue() }
    this.configureShipmentService();
    this.oService.update(kv, av, "shipmentSent").subscribe(result => {
      this.tableSend.refresh();
    })
  }

}
