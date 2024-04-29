import { DomSanitizer } from '@angular/platform-browser';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, NavigationService, ServiceResponse, OUserInfoService, OFormComponent } from 'ontimize-web-ngx';
import { Observable } from 'rxjs';
import { MainService } from '../shared/services/main.service';
import { UserInfoService } from '../shared/services/user-info.service';

@Component({
  selector: 'register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  public registerForm: UntypedFormGroup = new UntypedFormGroup({});
  public userCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public pwdCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  @ViewChild('form') form: OFormComponent;

  public sessionExpired = false;
  private redirect = '/toys';

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    @Inject(NavigationService) private navigationService: NavigationService,
    @Inject(AuthService) private authService: AuthService,
    @Inject(MainService) private mainService: MainService,
    @Inject(OUserInfoService) private oUserInfoService: OUserInfoService,
    @Inject(UserInfoService) private userInfoService: UserInfoService,
    @Inject(DomSanitizer) private domSanitizer: DomSanitizer
  ) {
    const qParamObs: Observable<any> = this.actRoute.queryParams;
    qParamObs.subscribe(params => {
      if (params) {
        if (params['session-expired']) {
          this.sessionExpired = (params['session-expired'] === 'true');
        } else {
          if (params['redirect']) {
            this.redirect = params['redirect'];
          }
          this.sessionExpired = false;
        }
      }
    });
  }

  ngOnInit(): any {
    this.navigationService.setVisible(false);

    this.registerForm.addControl('username', this.userCtrl);
    this.registerForm.addControl('password', this.pwdCtrl);
  }

  public register() {
    const userName = this.registerForm.value.username;
    const password = this.registerForm.value.password;
    
  
  }

  private handleError(error) {
    switch (error.status) {
      case 401:
        console.error('Email or password is wrong.');
        break;
      default: break;
    }
  }
}
