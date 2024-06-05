import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OCurrencyInputComponent, OEmailInputComponent, OTextInputComponent, ServiceResponse } from 'ontimize-web-ngx';
import { OMapComponent } from 'ontimize-web-ngx-map';
import { ChatComponent } from 'src/app/shared/components/chat/chat.component';
import { StripeComponent } from 'src/app/shared/components/stripe/stripe.component';
import { JukidsAuthService } from 'src/app/shared/services/jukids-auth.service';
import { MainService } from 'src/app/shared/services/main.service';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';

@Component({
  selector: 'app-toys-detail',
  templateUrl: './toys-detail.component.html',
  styleUrls: ['./toys-detail.component.scss']
})
export class ToysDetailComponent implements OnInit {

  private location: any;
  showCheckout = false;

  @ViewChild('toyId') toyId: OTextInputComponent;
  @ViewChild('usr_id') usr_id: OTextInputComponent;
  @ViewChild('nameInput') toyName: OTextInputComponent;
  @ViewChild('emailInput') toyEmail: OEmailInputComponent;
  @ViewChild('priceInput') priceInput: OCurrencyInputComponent;
  @ViewChild('shipping') shipping: OTextInputComponent;
  @ViewChild('latitude') lat: OTextInputComponent;
  @ViewChild('longitude') lon: OTextInputComponent;
  @ViewChild('LocationMap') oMapBasic: OMapComponent;
  @ViewChild('statusInput') toyStatus: OTextInputComponent;
  @ViewChild('stripe') stripe: StripeComponent;


  isLogged: boolean = this.jkAuthService.isLoggedIn();
  isNotTheSeller: boolean;
  customer_id: number;

  constructor(
    private toysMapService: ToysMapService,
    private router: Router,
    private dialog: MatDialog,
    private jkAuthService: JukidsAuthService,
    private mainService: MainService,

  ) { }

  openBuy(toyid): void {
    this.router.navigate(["main/toys/toysDetail/toysBuy", toyid]);
  }
  ngOnInit() {
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    });

    // console.log("ON INIT usr_id: ", this.usr_id.getValue() );
    // console.log("ON INIT jkAuthService.getSessionInfo().id: ", this.jkAuthService.getSessionInfo().id );
    // console.log("ON INIT is seller formula:  ", ( this.usr_id.getValue() == this.jkAuthService.getSessionInfo().id ) );
    // console.log("ON INIT isSeller var:  ", this.isSeller);
    
    // this.isSeller = ( this.usr_id.getValue() == this.jkAuthService.getSessionInfo().id );
  }

  showMeMore() {
    console.log(this.usr_id.getValue());
  }
  onFormDataLoaded(data: any) {
    this.toysMapService.setLocation(this.lat.getValue(), this.lon.getValue());

    this.mainService.getUserInfo().subscribe((data: ServiceResponse) => {
      
      this.customer_id = data.data.usr_id;
      
      this.isNotTheSeller = (data.data.usr_id != this.usr_id.getValue());
      
    });
    // console.log("ON INIT usr_id: ", this.usr_id.getValue() );
    // console.log("ON INIT jkAuthService.getSessionInfo().id: ", this.jkAuthService.getSessionInfo().id );
    // console.log("ON INIT is seller formula:  ", ( this.usr_id.getValue() == this.jkAuthService.getSessionInfo().id ) );

    // console.log("ON INIT isSeller var:  ", this.isSeller);


    this.setStripe();
  }

  setStripe(): void {
    this.stripe.toyId = this.toyId.getValue();
    this.stripe.product = this.toyName.getValue();
    this.stripe.email = this.toyEmail.getValue();
  }

  checkout() {
    this.stripe.ckeckout();
  }


  chatSeller() {

    this.dialog.open(ChatComponent, {
      data: {
        toyId: this.toyId.getValue(),
        price: this.priceInput.getValue(),
        toyName: this.toyName.getValue(),
        sellerName: this.toyEmail.getValue(),
        customer_id: this.customer_id
      },
      id: "Chat",
      disableClose: true,
    });

  }
}
