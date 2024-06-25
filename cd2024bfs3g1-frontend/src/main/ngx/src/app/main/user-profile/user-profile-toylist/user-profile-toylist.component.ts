import { ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { JukidsAuthService } from 'src/app/shared/services/jukids-auth.service';
import { OTableBase, OTableColumnComponent, OTextInputComponent, OntimizeService } from 'ontimize-web-ngx';
import { OTranslateService, DialogService, ODialogConfig, SnackBarService } from 'ontimize-web-ngx';
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
  infoToysSold: number = 0;
  public baseUrl: string;

  //Indice inicial para pestañas de tablas
  public currentToysTabIndex = 0; //First Tab

  @ViewChild('tableSend') protected tableSend :OTableBase ;
  @ViewChild('tableConfirm') protected tableConfirm : OTableBase;
  @ViewChild('senderAddress') protected senderAddress :OTextInputComponent;
  @ViewChild('senderAddress') protected shipmentAddress: OTableColumnComponent;
  @ViewChild('senderAddress') protected shipmentCompany: OTableColumnComponent;
  @ViewChild('toysTabs') toysTabGroup: MatTabGroup;

  public userInfo;
  private redirect = '/toys';

  constructor(
    private jukidsAuthService: JukidsAuthService,
    private router: Router,
    private translate: OTranslateService,
    protected dialogService: DialogService,
    protected snackBarService: SnackBarService,    
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
    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }

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
            this.infoToysSold = resp.data[0].price.toFixed(1);
          }
        }
      });
  }

  public configureShipmentsService() {
    const shipmentsConf = this.oService.getDefaultServiceConfiguration('shipments');
    this.oService.configureService(shipmentsConf);
  }

  public configureToyService() {
    const toysConf = this.oService.getDefaultServiceConfiguration('toys');
    this.oService.configureService(toysConf);
  }

  //Metodo de confirmar el envio por parte del vendedor
  //(con doble confirmacion, mensaje de confirmación y salto a la siguiente pestaña actualizada)
  public sendSubmit(e: any) {
    if (this.dialogService) {
      this.dialogService.confirm(this.translate.get('CONFIRMATION_TITLE'), this.translate.get('SEND_CONFIRMATION'));
      this.dialogService.dialogRef.afterClosed().subscribe( result => {
        if(result) {
          this.currentToysTabIndex = this.toysTabGroup.selectedIndex; //recoge el indice de pestaña actual
          const kv = { "toyid": e };
          const av = { "sender_address": this.senderAddress.getValue(),"transaction_status": this.STATUS_SENT }
          this.configureShipmentsService();
          this.oService.update(kv, av, "shipmentSent").subscribe(result => {
          this.tableSend.refresh();
          this.tableConfirm.refresh();
          this.currentToysTabIndex = this.currentToysTabIndex + 1; //actualica el indice de pestaña a la siguiente una vez confirmado
          })
          this.snackBarService.open(this.translate.get('CONFIRMED'));
        } else {
          this.snackBarService.open(this.translate.get('CANCELLED'));
        }
      })
    }
  }
}
