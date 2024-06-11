import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OCurrencyInputComponent, OEmailInputComponent, OTextInputComponent, OntimizeService, ServiceResponse } from 'ontimize-web-ngx';
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
  protected service: OntimizeService;
  showCheckout = false;
  isEditable = false;
  ratingData: string;
  varRating: number;
  isLogged: boolean = this.jkAuthService.isLoggedIn();
  isNotTheSeller: boolean;

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
      protected injector: Injector,
      private router: Router,
      private dialog: MatDialog,
      private jkAuthService: JukidsAuthService,
      private mainService: MainService,
  ) {
    this.service = this.injector.get(OntimizeService);
    this.configureService();
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration("toys");
    this.service.configureService(conf);
  }

  openBuy(toyid): void {
    this.router.navigate(["main/toys/toysDetail/toysBuy", toyid]);
  }
  ngOnInit() {
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    });
  }

  showMeMore() {
    console.log(this.usr_id.getValue());
  }
  onFormDataLoaded(data: any) {
    this.toysMapService.setLocation(this.lat.getValue(), this.lon.getValue())

    this.mainService.getUserInfo().subscribe((data: ServiceResponse) => {

      this.isNotTheSeller = (data.data.usr_id != this.usr_id.getValue());

    });

    this.setStripe();

    const filter = {
      usr_id: this.usr_id.getValue(),
    };
    const columns = ["usr_name", "usr_photo", "rating"];
    this.service
      .query(filter, columns, "userAverageRating")
      .subscribe((resp) => {
        console.log(resp.data[0]);
        if (resp.code === 0 && resp.data.length > 0) {
          this.varRating = resp.data[0].rating.toFixed(1);
          this.ratingData = resp.data[0].usr_name + " : " + this.varRating;
        } else {
          this.ratingData = resp.data[0].usr_name;
        }
      });
  }

  redirect(){
    this.router.navigateByUrl("/main/toys");
  }

  setStripe(): void {
    this.stripe.toyId = this.toyId.getValue();
    this.stripe.product = this.toyName.getValue();
    this.stripe.email = this.toyEmail.getValue();
  }

  checkout() {
    this.stripe.ckeckout();
  }

  searchCategory(category):void {
    this.router.navigate(['/main/toys'], {queryParams:{category: category}});
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
      width: '25rem',
      height: '37.5rem',
      id: "Chat",
      disableClose: true,
    });

  }
}
