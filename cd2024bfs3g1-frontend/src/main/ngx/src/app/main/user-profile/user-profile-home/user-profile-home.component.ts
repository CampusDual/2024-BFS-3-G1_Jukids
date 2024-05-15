import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'ontimize-web-ngx';
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
    private authService: AuthService,
    private router: Router,
    public userInfoService: UserInfoService) {
    this.userInfo = this.userInfoService.getUserInfo();
    if (!this.authService.isLoggedIn()) {
      const self = this;
      self.router.navigate([this.redirect]);
    }
  }
  
  ngOnInit(): void {
    console.log('hey');
    console.log(this.userInfo);
  }
;

  toToyList() {
    this.router.navigate(["/main/user-profile/toylist"]);
  }

}