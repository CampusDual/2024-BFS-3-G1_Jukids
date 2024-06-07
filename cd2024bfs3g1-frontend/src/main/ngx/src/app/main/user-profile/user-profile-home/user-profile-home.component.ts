import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'ontimize-web-ngx';
import { JukidsAuthService } from 'src/app/shared/services/jukids-auth.service';
import { UserInfoService } from 'src/app/shared/services/user-info.service';


@Component({
  selector: 'app-user-profile-home',
  templateUrl: './user-profile-home.component.html',
  styleUrls: ['./user-profile-home.component.css']
})
export class UserProfileHomeComponent implements OnInit {
  public userInfo;
  private redirect = '/toys';

  constructor(
    private jukidsAuthService: JukidsAuthService,
    private router: Router,
    public userInfoService: UserInfoService) {
    this.userInfo = this.userInfoService.getUserInfo();
    if (!this.jukidsAuthService.isLoggedIn()) {
      const self = this;
      self.router.navigate([this.redirect]);
    }
  }
  
  ngOnInit(): void {}

  toToyList() {
    this.router.navigate(["/main/user-profile/toylist"]);
  }

  toBuyList() {
    this.router.navigate(["/main/user-profile/buylist"]);
  }

  toMyRatings(){
    this.router.navigate(["/main/user-profile/ratings"]);
  }

}
