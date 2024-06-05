import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { OntimizeService } from 'ontimize-web-ngx';
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
  protected service: OntimizeService;

  varRating: number = 0;
  ratingData: string = 'No rating available';

  constructor(
    private jukidsAuthService: JukidsAuthService,
    private router: Router,
    public userInfoService: UserInfoService,
    protected injector: Injector
  ) {
    this.userInfo = this.userInfoService.getUserInfo();
    if (!this.jukidsAuthService.isLoggedIn()) {
      this.router.navigate([this.redirect]);
    }

    this.service = this.injector.get(OntimizeService);
    this.configureService();
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('surveys');
    this.service.configureService(conf);
  }

  ngOnInit(): void {
    this.onFormDataLoaded(); // Cargar los datos al iniciar
  }

  onFormDataLoaded() {
    const filter = {
      usr_id: this.userInfo.usr_id // Usa directamente el usr_id de userInfo
    };
    const columns = ['usr_name', 'usr_photo', 'rating'];
    this.service
      .query(filter, columns, 'userAverageRating')
      .subscribe((resp) => {
        console.log(resp.data[0]);
        if (resp.code === 0 && resp.data.length > 0) {
          this.varRating = resp.data[0].rating.toFixed(1);;
        } else {
          this.varRating = 0;
        }
    });
  }

  toToyList() {
    this.router.navigate(['/main/user-profile/toylist']);
  }

  toBuyList() {
    this.router.navigate(['/main/user-profile/buylist']);
  }

  toMyRatings() {
    this.router.navigate(['/main/user-profile/ratings']);
  }

  toMyEdit(){
    this.router.navigate(['/main/user-profile/edit-user']);
  }

}
