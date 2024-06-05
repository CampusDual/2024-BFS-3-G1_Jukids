import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'ontimize-web-ngx';
import { JukidsAuthService } from 'src/app/shared/services/jukids-auth.service';
import { UserInfoService } from 'src/app/shared/services/user-info.service';
import { OTextInputComponent, OntimizeService } from 'ontimize-web-ngx';



@Component({
  selector: 'app-user-profile-home',
  templateUrl: './user-profile-home.component.html',
  styleUrls: ['./user-profile-home.component.css']
})
export class UserProfileHomeComponent implements OnInit{
  public userInfo;
  private redirect = '/toys';
  protected service: OntimizeService;

  varRating: number;
  //ratingData: string;

  @ViewChild('usr_id') usr_id: OTextInputComponent;

  constructor(
    private jukidsAuthService: JukidsAuthService,
    private router: Router,
    public userInfoService: UserInfoService,
    protected injector: Injector) {
    this.userInfo = this.userInfoService.getUserInfo();
    if (!this.jukidsAuthService.isLoggedIn()) {
      const self = this;
      self.router.navigate([this.redirect]);
    }

    this.service = this.injector.get(OntimizeService);
    this.configureService();
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration("surveys");
    this.service.configureService(conf);
  }

  ngOnInit(): void {}

  onFormDataLoaded(data: any) {
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
          //this.ratingData = resp.data[0].usr_name + " : " + this.varRating;
        }
      });
  }

  toToyList() {
    this.router.navigate(["/main/user-profile/toylist"]);
  }

  toBuyList() {
    this.router.navigate(["/main/user-profile/buylist"]);
  }

  toMyRatings() {
    this.router.navigate(["/main/user-profile/ratings"]);
  }
}
