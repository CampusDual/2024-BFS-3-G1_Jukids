import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { OFormComponent, OTextInputComponent, OntimizeService, ServiceResponse } from 'ontimize-web-ngx';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  private redirect = '/main/user-profile';
  protected service: OntimizeService;

  @ViewChild('formUserEdit') formUserEdit: OFormComponent;

  usrId: number = null;
  mainInfo: any = {};

  constructor(
    private router: Router,
    private mainService: MainService,
    private injector: Injector
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
    const formData = this.formUserEdit.getDataValues();
    if (this.validateData(formData)) {
      this.service.update(formData, ['usr_id']).subscribe(
        response => {
          if (response.code === 0) {
            this.router.navigate([this.redirect]);
          } else {
            console.error('Error updating user profile', response.message);
          }
        },
        error => {
          console.error('Error updating user profile', error);
        }
      );
    }
  }

  validateData(data: any): boolean {
    return data.usr_name && data.usr_surname && data.usr_login && data.usr_password;
  }

  profileRedirect() {
    this.router.navigate([this.redirect]);
  }

  redirectHome(){
    const self = this;
      self.router.navigate([this.redirect]);
  }
}
