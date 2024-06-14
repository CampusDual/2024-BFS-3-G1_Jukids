import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { AuthService, DialogService, ODialogConfig, SnackBarService, OFormComponent, OTableBase, OTextInputComponent, OTranslateService, OntimizeService } from 'ontimize-web-ngx';
import { UserInfoService } from 'src/app/shared/services/user-info.service';

@Component({
  selector: 'app-user-profile-buylist',
  templateUrl: './user-profile-buylist.component.html',
  styleUrls: ['./user-profile-buylist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserPurchasedToylistComponent {
  baseUrl: string;
  public userInfo;
  private redirect = '/toys';

  //Indice inicial para pestañas de tablas
  public currentTabIndex = 0; //First Tab

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
  @ViewChild('tabs') tabGroup: MatTabGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: OTranslateService,
    protected dialogService: DialogService,
    protected snackBarService: SnackBarService,
    private oServiceShipment: OntimizeService,
    public userInfoService: UserInfoService,
    private sharedDataService:SharedDataService) {

    const conf2 = this.oServiceShipment.getDefaultServiceConfiguration('shipments');
    this.oServiceShipment.configureService(conf2);

    this.userInfo = this.userInfoService.getUserInfo();
    if (!this.authService.isLoggedIn()) {
      const self = this;
      self.router.navigate([this.redirect]);
    }
  }

  //Cambia de estado 2 a 3 y refesca las tablas de ambos estados
  //pide confirmación, muestra mensaje de confirmación, lanza a la siguiente pestaña actualizada
  public checkReceive(e: any) {
    if (this.dialogService) {
      this.dialogService.confirm(this.translate.get('CONFIRMATION_TITLE'), this.translate.get('RECEPTION_CONFIRMATION'));
      this.dialogService.dialogRef.afterClosed().subscribe( result => {
        if(result) {
          const kv = {"toyid": e.toyid};
          const av = {"transaction_status": this.STATUS_RECEIVED}
          this.oServiceShipment.update(kv, av, "shipmentReceived").subscribe(result => {      
            this.tableReceived.refresh();
            this.tableConfirm.refresh();
            this.currentTabIndex = this.tabGroup.selectedIndex; //recoge el indice de pestaña actual
            this.currentTabIndex = this.currentTabIndex + 1; //actualica el indice de pestaña a la siguiente una vez confirmado
          })
          this.snackBarService.open(this.translate.get('CONFIRMED'));
        } else {
          this.snackBarService.open(this.translate.get('CANCELLED'));
        }
      })
    }
  }

  //Cambia de estado 3 a 4 y refesca las tablas de ambos estados
  //Pide confirmación, muestra mensaje de confirmación, lanza a la siguiente pestaña actualizada
  public checkOk(e: any){
      if (this.dialogService) {
      this.dialogService.confirm(this.translate.get('CONFIRMATION_TITLE'), this.translate.get('OK_CONFIRMATION'));
      this.dialogService.dialogRef.afterClosed().subscribe( result => {
        if(result) {
          const kv = {"toyid": e.toyid};
          const av = {"transaction_status": this.STATUS_PURCHASED}
          this.oServiceShipment.update(kv, av, "shipmentConfirmed").subscribe(result => {
            this.tableConfirm.refresh();
            this.tablePurchased.refresh();
            this.currentTabIndex = this.tabGroup.selectedIndex; //recoge el indice de pestaña actual          
            this.currentTabIndex = this.currentTabIndex + 1; //actualica el indice de pestaña a la siguiente una vez confirmado
          })
          this.snackBarService.open(this.translate.get('CONFIRMED'));
        } else {
          this.snackBarService.open(this.translate.get('CANCELLED'));
        }
      })
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

  onRate(toyId:number,toyPhoto: string, toyName:string, sellerId:number, sellerName:string, buyerId:number){
    // Almacenar valores para compartirlos a través del servicio
    this.sharedDataService.setData({ toyId, toyPhoto, toyName, sellerId, sellerName, buyerId});
    this.router.navigate(["/survey"]);
  }

  ngOnInit(): void {
    this.baseUrl = window.location.origin;

    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }
  }

  public openDetail(data: any): void {
    // Aquí redirigimos a la ruta de detalle de juguete y pasamos el ID como parámetro
    this.router.navigate(["./main/user-profile/buylist/toysDetail", data]);
  }

  public pay(e: any){
    this.router.navigate(["./main/toys/toysDetail/toysBuy", e.toyid]);
  }
}
