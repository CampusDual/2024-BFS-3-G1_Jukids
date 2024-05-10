import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-home',
  templateUrl: './user-profile-home.component.html',
  styleUrls: ['./user-profile-home.component.css']
})
export class UserProfileHomeComponent {

  constructor( private router: Router){};

  toToyList() {
    this.router.navigate(["/main/user-profile/toylist"]);
  }

}
