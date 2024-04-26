import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, OAppLayoutComponent } from 'ontimize-web-ngx';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {}
/*Se importa el modulo padre APPLayour con la anoticacion ViewChild para poder acceder al método ShowUserInfo y analizar en cliente si tras logearse, se recibe o no
en la etiqueta "o-user-info-configuration" datos de usuario y por cuanto tiempo antes del Bug de borrar perfil al refrescar. */
@ViewChild('appLayout')
public appLayout: OAppLayoutComponent;

  redirect() {
    this.router.navigateByUrl('/login');
  }

  register(){
    this.router.navigateByUrl('/register');
  }

  isLogged(){
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
  }

}
