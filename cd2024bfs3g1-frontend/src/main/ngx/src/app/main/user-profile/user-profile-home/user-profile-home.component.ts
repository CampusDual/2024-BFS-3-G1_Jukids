import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OFormComponent, OTextInputComponent, OntimizeService, ServiceResponse } from 'ontimize-web-ngx';
import { JukidsAuthService } from 'src/app/shared/services/jukids-auth.service';
import { MainService } from 'src/app/shared/services/main.service';
import { UserInfoService } from 'src/app/shared/services/user-info.service';

@Component({
  selector: 'app-user-profile-home',
  templateUrl: './user-profile-home.component.html',
  styleUrls: ['./user-profile-home.component.scss']
})
export class UserProfileHomeComponent implements OnInit {
  
    @ViewChild('usr_id') usrIdField : OTextInputComponent;
    @ViewChild('formUserDetail') formUserDetail:OFormComponent;
      //============== Variable de URL BASE =================
  public baseUrl: string;

  public userInfo;
  private redirect = '/toys';
  protected service: OntimizeService;

  varRating: number = 0;
  ratingData: string = 'No rating available';
  usrId : number = null;
  mainInfo: any = {};
  
  constructor(
    private jukidsAuthService: JukidsAuthService,
    private router: Router,
    public userInfoService: UserInfoService,
    protected injector: Injector,
    private mainService: MainService
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
  loadFormData() {
    if (this.formUserDetail) {
      this.formUserDetail.setData(this.mainInfo);
    }
  }
  
  ngOnInit(): void {
    this.mainService.getUserInfo().subscribe((result: ServiceResponse) => {
        this.usrId = result.data["usr_id"]; 
        this.usrIdField.setValue(this.usrId);
        this.mainInfo = result.data;  // Guardar los datos en mainInfo
        this.dataLoaded(); // Cargar los datos al cargar el id
    })

    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }
  }

  dataLoaded() {
    const filter = {
      //usr_id: this.userInfo.usr_id 
      usr_id: this.usrId
    };

    // consulta para datos de usuario
    const confUser = this.service.getDefaultServiceConfiguration('userowner');
    this.service.configureService(confUser);

    // consulta para rating
    const confSurveys = this.service.getDefaultServiceConfiguration('surveys');
    this.service.configureService(confSurveys);
    
    const columns = ['usr_name', 'usr_photo', 'rating'];
    this.service
      .query(filter, columns, 'userAverageRating')
      .subscribe((resp) => {
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
