import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { OFormComponent, OTextInputComponent, OntimizeService, ServiceResponse } from 'ontimize-web-ngx';
import { race } from 'rxjs';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  private redirect = '/main/user-profile';
  baseUrl: string;
  protected service: OntimizeService;

  @ViewChild('usr_id') usrIdField : OTextInputComponent;
  @ViewChild('formUserEdit') formUserEdit: OFormComponent;
  /*@ViewChild('nameInput') nameInput : OTextInputComponent;
  @ViewChild('surnameInput') surnameInput : OTextInputComponent;
  @ViewChild('passwordInput') passwordInput : OTextInputComponent;
  @ViewChild('emailInput') emailInput : OTextInputComponent;*/

  usrId : number = null;
  mainInfo: any = {};

  constructor (
    private router: Router,
    private mainService: MainService,
    private injector : Injector
  ) {
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
      //this.usrIdField.setValue(this.usrId);
      this.mainInfo = result.data;
      this.dataLoaded();
  })
  }

  dataLoaded() {
    const filter = {
      //usr_id: this.userInfo.usr_id 
      usr_id: this.usrId
    };

    // consulta para datos de usuario
    const confUser = this.service.getDefaultServiceConfiguration('userowner');
    this.service.configureService(confUser);
  }
  profileRedirect(){
    const self = this;
      self.router.navigate([this.redirect]);
  }
}
