import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'ontimize-web-ngx';
import { UserInfoService } from 'src/app/shared/services/user-info.service';

@Component({
  selector: 'app-user-profile-toylist',
  templateUrl: './user-profile-toylist.component.html',
  styleUrls: ['./user-profile-toylist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class UserProfileToylistComponent {
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

  ngOnInit() {
  }

  public openToyEdit(toyid:number): void {
     console.log("***********");
     console.log(toyid);
     console.log("***********");
     this.router.navigate(["/main/user-profile/edit-toy", toyid]);
  }
  
}
