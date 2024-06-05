import { ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JukidsAuthService } from 'src/app/shared/services/jukids-auth.service';
import { OTableBase, OTableColumnComponent, OTextInputComponent, OntimizeService } from 'ontimize-web-ngx';
import { UserInfoService } from 'src/app/shared/services/user-info.service';
import { pipe } from 'rxjs';

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
  sumPriceData: string;
  infoToysSold: string;

  @ViewChild('tableSend') protected tableSend :OTableBase ;
  @ViewChild('senderAddress') protected senderAddress :OTextInputComponent;
  @ViewChild('senderAddress') protected shipmentAddress: OTableColumnComponent;
  @ViewChild('senderAddress') protected shipmentCompany: OTableColumnComponent;

  public userInfo;
  private redirect = '/toys';

  constructor(
    private jukidsAuthService: JukidsAuthService,
    private router: Router,
    private oServiceShipment: OntimizeService,
    private oServiceToys: OntimizeService,
    public userInfoService: UserInfoService,
    protected injector: Injector) {

    const toysConf = this.oServiceToys.getDefaultServiceConfiguration('toys');
    const conf2 = this.oServiceShipment.getDefaultServiceConfiguration('shipments');
    this.oServiceShipment.configureService(conf2);
    this.oServiceToys.configureService(toysConf);



    this.userInfo = this.userInfoService.getUserInfo();
    if (!this.jukidsAuthService.isLoggedIn()) {
      const self = this;
      self.router.navigate([this.redirect]);
    }
  }
  ngOnInit(): void {

    const filter = {
      usr_id: this.userInfo.usr_id
    };

    const columns = ["usr_id", "price"];
    this.oServiceToys
      .query(filter, columns, "sumPriceToysSold")
      .subscribe({
        next: (resp:any) => {
          console.log(resp.data[0].price);
          if (resp.code === 0 && resp.data.length > 0) {
            this.infoToysSold = ": " +  resp.data[0].price.toFixed(1) + " €";
          } else {
            this.infoToysSold = "0 €";
          }
        }
      });
  }

  public sendSubmit(e) {
    const kv = { "toyid": e };
    const av = { "sender_address": this.senderAddress.getValue(),"transaction_status": this.STATUS_SENT }
    this.oServiceShipment.update(kv, av, "shipmentSent").subscribe(result => {
      this.tableSend.refresh();
    })
  }


}
