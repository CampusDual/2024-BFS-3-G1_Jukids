import { Component, Injector, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { OAppLayoutComponent, OUserInfoConfigurationDirective, OUserInfoService, ServiceResponse, OTextInputComponent, } from "ontimize-web-ngx";
import { MainService } from "../shared/services/main.service";
import { UserInfoService } from "../shared/services/user-info.service";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "../login/login.component";
import { JukidsAuthService } from "../shared/services/jukids-auth.service";
import { Location } from "@angular/common";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild("searcherkey") searcherkey: ElementRef;

  /*Se importa el modulo padre APPLayour con la anoticacion ViewChild para poder acceder al método ShowUserInfo y analizar en cliente si tras logearse, se recibe o no
  en la etiqueta "o-user-info-configuration" datos de usuario y por cuanto tiempo antes del Bug de borrar perfil al refrescar. */
  @ViewChild('appLayout')
  public appLayout: OAppLayoutComponent;
  public rolename : string;
  protected userInfo;

  @ViewChild('userConfiguration')
  public userConfiguration: OUserInfoConfigurationDirective;
  // public logoutItem: OUserInfoConfigurationItemDirective;

  //TODO: Ver la redireccion con el nuevo flujo
  adminRedirect(){
    this.router.navigateByUrl('/main/admin');
  }

  constructor(
    protected injector: Injector,
    private router: Router,
    private jkAuthService: JukidsAuthService,
    private mainService: MainService,
    private userInfoService: UserInfoService,
    private domSanitizer: DomSanitizer,
    private oUserInfoService: OUserInfoService,
    private dialog: MatDialog,
    private location: Location
  ) { }

  isLogged() {
    //Se cierra el dialogo al iniciar sesion
    if (this.jkAuthService.isLoggedIn() && this.dialog.getDialogById('login')) {
      this.dialog.closeAll();

     // Se obtiene la información del usuario logueado
     this.userInfo = this.userInfoService.getUserInfo();
     this.rolename = this.userInfo.rolename;
    }
    return this.jkAuthService.isLoggedIn();
  }

  //Con este metodo verificamos que el usuario que se ha logueado, tenga una propiedad rolename y su valor sea el de admin
  validAdmin(){
    return (this.rolename && this.rolename == "admin");
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

          //Recogemos el campo rolename en el front que trajimos del back y lo asignamos a una variable publica en el componente
          if (result.data['rolename']) {
            this.rolename = result.data['rolename']
          }
          this.oUserInfoService.setUserInfo({
            username: result.data['usr_name'],
            avatar: avatar
          });
        }
      );
  }

  modal(idModal: string) {
    this.dialog.open(LoginComponent, {
      id: idModal,
      disableClose: false,
    });
  }

  searchNameAndDescription(searcherInput: HTMLInputElement){
    const searchValue = searcherInput.value;

    if(searchValue && searchValue.trim().length > 0){
      this.router.navigate(['/main/toys'], {queryParams:{keyword: searchValue}});
    }
  }

  clearInput(searcherInput: HTMLInputElement) {
    searcherInput.value = '';
    this.router.navigate(['/main/toys']).then(() =>{
      window.location.reload();
    });
  }

  newToy(){
    if(this.jkAuthService.isLoggedIn()){
      const redirect = '/main/toys/new';
      this.router.navigate([redirect]);
    } else {
      this.modal('login');
    }
  }

  goBack(){
    this.location.back();
  }

}
