import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService, NavigationService, ServiceResponse, OUserInfoService, OFormComponent } from 'ontimize-web-ngx';
import { Router } from '@angular/router';
import { MainService } from '../../shared/services/main.service';
import { UserInfoService } from '../../shared/services/user-info.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginComponent } from '../login.component';
import { JukidsAuthService } from 'src/app/shared/services/jukids-auth.service';



@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  @ViewChild('form') form: OFormComponent;
  public registerForm: UntypedFormGroup = new UntypedFormGroup({});
  public userCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public pwdCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);

  public sessionExpired = false;
  private redirect = '/toys';

  constructor(
    private router: Router,
    private loginComponent: LoginComponent,
    @Inject(NavigationService) private navigationService: NavigationService,
    @Inject(JukidsAuthService) private jukidsAuthService: JukidsAuthService,
    @Inject(MainService) private mainService: MainService,
    @Inject(UserInfoService) private userInfoService: UserInfoService,
    @Inject(DomSanitizer) private domSanitizer: DomSanitizer,
    @Inject(OUserInfoService) private oUserInfoService: OUserInfoService,
  ) {

  }

  ngOnInit(): any {
    this.navigationService.setVisible(false);

    this.registerForm.addControl('email', this.userCtrl);
    this.registerForm.addControl('password', this.pwdCtrl);

    if (this.jukidsAuthService.isLoggedIn()) {
      this.router.navigate([this.redirect]);
    } else {
      this.jukidsAuthService.clearSessionData();
    }
  }

  public login() {
    const userName = this.form.getFieldValue("usr_login");
    const password = this.form.getFieldValue("usr_password");

    if (userName && userName.length > 0 && password && password.length > 0) {
      const self = this;
      this.jukidsAuthService.login(userName, password)
        .subscribe(() => {
          self.sessionExpired = false;
          this.loadUserInfo();
          self.router.navigate([this.redirect]);
        }, this.handleError);
    }
  }

  private loadUserInfo() {
    this.mainService.getUserInfo()
      .subscribe(
        (result: ServiceResponse) => {
          this.userInfoService.storeUserInfo(result.data);
          let avatar = './assets/images/user_profile.png';
          if (result.data['usr_photo']) {
            (avatar as any) = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + result.data['usr_photo']);
          }
          this.oUserInfoService.setUserInfo({
            username: result.data['usr_name'],
            avatar: avatar
          });
        }
      );
  }

  private handleError(error) {
    switch (error.status) {
      case 401:
        console.error('Email or password is wrong.');
        break;
      default: break;
    }
  }

  public cancel() {
    this.loginComponent.isRegistering = false;
  }
}
