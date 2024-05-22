import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'ontimize-web-ngx';
import { UserInfoService } from 'src/app/shared/services/user-info.service';

@Component({
  selector: 'app-user-profile-buylist',
  templateUrl: './user-profile-buylist.component.html',
  styleUrls: ['./user-profile-buylist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class UserPurchasedToylistComponent {
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

  public openToyEdit(e:any): void {
    
    this.router.navigate(["/main/user-profile/edit-toy", e.toyid]);
  }
}
