import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  private redirect = '/main/user-profile';
  baseUrl: string;

  constructor (
    private router: Router
  ) {}

  ngOnInit(): void {
    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }
  }

  profileRedirect(){
    const self = this;
      self.router.navigate([this.redirect]);
  }
}
