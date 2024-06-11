import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OEmailInputComponent, OTextInputComponent, OntimizeService, ServiceResponse } from 'ontimize-web-ngx';
import { OMapComponent } from 'ontimize-web-ngx-map';
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
  varPhoto: string;
  varName: string;
  isLogged: boolean = this.jkAuthService.isLoggedIn();
  isNotTheSeller: boolean;

  @ViewChild('toyId') toyId: OTextInputComponent;
  @ViewChild('usr_id') usr_id: OTextInputComponent;
  @ViewChild('nameInput') toyName: OTextInputComponent;
  @ViewChild('emailInput') toyEmail: OEmailInputComponent;
  @ViewChild('shipping') shipping: OTextInputComponent;
  @ViewChild('latitude') lat: OTextInputComponent;
  @ViewChild('longitude') lon: OTextInputComponent;
  @ViewChild('LocationMap') oMapBasic: OMapComponent;
  @ViewChild('statusInput') toyStatus: OTextInputComponent;
  @ViewChild('stripe') stripe: StripeComponent;

  constructor(
    private toysMapService: ToysMapService, 
    private router: Router,
    protected injector: Injector,
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

        /* if(resp.code === 0 && resp.data.length > 0){
          this.varRating = resp.data[0].rating.toFixed(1);
          this.varName = resp.data[0].usr_name;
          this.varPhoto = resp.data[0].usr_photo;
        }else {
          this.varName = resp.data[0].usr_name;
          this.varPhoto = resp.data[0].usr_photo;
          this.varRating = 0/5;
        } */


        if (resp.code === 0 && resp.data.length > 0) {
          this.varRating = resp.data[0].rating.toFixed(1);
          this.varPhoto = resp.data[0].usr_photo;
          //this.ratingData = resp.data[0].usr_photo + " " + resp.data[0].usr_name + " : " + this.varRating;
          console.log(this.varRating)
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

  
}
