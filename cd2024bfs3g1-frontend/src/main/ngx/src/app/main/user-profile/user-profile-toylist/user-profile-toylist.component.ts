import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoService } from 'src/app/shared/services/user-info.service';

@Component({
  selector: 'app-user-profile-toylist',
  templateUrl: './user-profile-toylist.component.html',
  styleUrls: ['./user-profile-toylist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class UserProfileToylistComponent {
  public userInfo;
  constructor(
    private router: Router,
    public userInfoService: UserInfoService) {
    this.userInfo = this.userInfoService.getUserInfo();
  }

  ngOnInit() {
  }
  
  edit() {
  alert("Editar");
  }

  public openToyDetail(): void {
    //  console.log("***********");
    //  console.log(toyid);
    //  console.log("***********");
     this.router.navigate(["/main/user-profile/toydetail"]);
  }
  
}
