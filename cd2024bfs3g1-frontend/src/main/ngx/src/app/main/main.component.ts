import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, OAppLayoutComponent, OUserInfoService, ServiceResponse } from 'ontimize-web-ngx';
import { MainService } from '../shared/services/main.service';
import { UserInfoService } from '../shared/services/user-info.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(
    private router: Router, 
    private authService: AuthService,
    private mainService: MainService,
    private userInfoService: UserInfoService,
    private domSanitizer: DomSanitizer,
    private oUserInfoService: OUserInfoService
  ) {}
/*Se importa el modulo padre APPLayour con la anoticacion ViewChild para poder acceder al método ShowUserInfo y analizar en cliente si tras logearse, se recibe o no
en la etiqueta "o-user-info-configuration" datos de usuario y por cuanto tiempo antes del Bug de borrar perfil al refrescar. */
@ViewChild('appLayout')
public appLayout: OAppLayoutComponent;

  redirect() {
    this.router.navigateByUrl('/login');
  }

  register(){
    this.router.navigateByUrl('/login/new');
  }

  isLogged(){
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.loadUserInfo();
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

}
