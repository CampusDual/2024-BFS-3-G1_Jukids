import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DialogService, OFormComponent,  OTranslateService,  OUserInfoService, OntimizeService, ServiceResponse } from 'ontimize-web-ngx';
import { JukidsAuthService } from 'src/app/shared/services/jukids-auth.service';
import { MainService } from 'src/app/shared/services/main.service';
import { UserInfoService } from 'src/app/shared/services/user-info.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  private redirectToyList = '/main/user-profile/toylist'
  private redirect = '/main/user-profile';
  protected service: OntimizeService;

  @ViewChild('formUserEdit') formUserEdit: OFormComponent;

  usrId: number = null;
  mainInfo: any = {};
  ontiInfo: any = {};
  formData: any = {};

  constructor(

    private jukidsAuthService: JukidsAuthService,
    private translate: OTranslateService,
    private router: Router,
    private mainService: MainService,
    private injector: Injector,
    private userInfoService: UserInfoService,
    private domSanitizer: DomSanitizer,
    private oUserInfoService: OUserInfoService,
    protected dialogService: DialogService
  ) {
    if (!this.jukidsAuthService.isLoggedIn()) {
      const self = this;
      self.router.navigate(["/toys"]);
    }
    this.service = this.injector.get(OntimizeService);
    this.configureService();
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('userowner');
    this.service.configureService(conf);
  }

  ngOnInit(): void {
    this.mainService.getUserInfo().subscribe((result: ServiceResponse) => {
      this.usrId = result.data["usr_id"];
      this.mainInfo = result.data;
      this.loadFormData();
    });
  }

  loadFormData() {
    if (this.formUserEdit) {
      this.formUserEdit.setData(this.mainInfo);
    }
  }

  saveForm() {
    this.formData = this.formUserEdit.getFieldValues(['usr_id', 'usr_login','usr_name', 'usr_surname', 'usr_password', 'usr_photo']);
    const kv = {"usr_id": this.formData};
    const av = {
      "usr_photo": this.formData.usr_photo,
      "usr_name": this.formData.usr_name,
      "usr_surname": this.formData.usr_surname,
      "usr_password": this.formData.usr_password,
      "usr_login": this.formData.usr_login
    }

    let errorEmail = "ERROR_EMAIL_EXIST";
    if (this.validateData(this.formData)) {
      this.service.update(kv, av, "user").subscribe({
        next: response => {
          if (response.code === 0) {
            this.updateSession();
            this.profileRedirect();
          }else{
            console.error(this.translate.get("ERROR_EMAIL_VALIDATION"))
          }
        },
        error: error => {
          console.error('Error updating user profile', error);
          this.showCustom(errorEmail);
        }
    });
    } else {

      this.showErrorValidate();
    }
  }

  loadUpdatedUserData() {
    if (this.usrId !== null) {
      this.service.query({ usr_id: this.usrId }, ['usr_id', 'usr_name', 'usr_surname', 'usr_login', 'usr_password', 'usr_photo']).subscribe(
        res => {
          if (res.code === 0) {
            this.mainInfo = res.data[0];
            this.loadFormData();
          } else {
            console.error('Error loading updated user data', res.message);
          }
        },
        error => {
          console.error('Error loading updated user data', error);
        }
      );
    }
  }

  validateData(data: any): boolean {
    if (data.usr_photo || data.usr_name || data.usr_surname || data.usr_login || data.usr_password) {
      return true;
    } else {
      return false;
    }

  }


  redirectList(){
    const self = this;
      self.router.navigate([this.redirectToyList]);
  }

  profileRedirect() {
    this.router.navigate([this.redirect]);
  }

  updateSession(){
          this.userInfoService.storeUserInfo(this.formData);
          let avatar = './assets/images/user_profile.png';
          if (this.formUserEdit.getDataValue('usr_photo')) {
            (avatar as any) = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.formUserEdit.getDataValue('usr_photo').value);
          }
          this.oUserInfoService.setUserInfo({
            username: this.formUserEdit.getDataValue('usr_name').value,
            avatar: avatar
          });
  }
  showCustom(errorEmail: string) {
    if (this.dialogService) {
      this.dialogService.info('ERROR',
          errorEmail);
      }
  }

  showErrorValidate(){
    if(this.dialogService ){
      this.dialogService.info('ERROR',
        'VALIDATE_ERROR'
      )
    }
  }
}
