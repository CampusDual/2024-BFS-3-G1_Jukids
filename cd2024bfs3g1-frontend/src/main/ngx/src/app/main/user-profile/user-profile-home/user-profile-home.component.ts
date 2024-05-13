import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-user-profile-home',
  templateUrl: './user-profile-home.component.html',
  styleUrls: ['./user-profile-home.component.css']
})
export class UserProfileHomeComponent {
  private redirect = '/toys';

  constructor(
    private authService: AuthService,
    private router: Router) {
    if (!this.authService.isLoggedIn()) {
      const self = this;
      self.router.navigate([this.redirect]);
    }
  };

  toToyList() {
    this.router.navigate(["/main/user-profile/toylist"]);
  }

}
