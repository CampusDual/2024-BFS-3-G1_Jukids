import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, DialogService, ODialogConfig, OFormComponent, ORealInputComponent, OTranslateService, OntimizeService } from 'ontimize-web-ngx';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';

@Component({
  selector: 'app-edit-toy',
  templateUrl: './edit-toy.component.html',
  styleUrls: ['./edit-toy.component.scss']
})
export class EditToyComponent implements OnInit {
  private redirect = '/main/user-profile/toylist'
  private location: any;
  public longitude;
  public latitude;
  @ViewChild('latitude') protected lat: ORealInputComponent;
  @ViewChild('longitude') protected lon: ORealInputComponent;
  @ViewChild('formToyEdit') protected formToyEdit: OFormComponent;
  isMapLatLongSelected: boolean = true;
  public locationSelected = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ontimizeService: OntimizeService,
    private toysMapService: ToysMapService,
    private translate: OTranslateService,
    protected dialogService: DialogService,
  ) {
      if (!this.authService.isLoggedIn()) {
        const self = this;
        self.router.navigate(["/toys"]);
      }

  }

  ngOnInit() {
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    });
  }

  onFormDataLoaded(data: any) {
    this.toysMapService.setLocation(this.lat.getValue(), this.lon.getValue())
  }

  handleMapClick(e) {
    let latitude = this.location.latitude;
    let longitude = this.location.longitude;

    this.lat.setValue(latitude);
    this.lon.setValue(longitude);

    this.locationSelected = true;
    this.isMapLatLongSelected = true;
  }

  redirectList(){
    const self = this;
      self.router.navigate([this.redirect]);
  }

  showCustom(
    icon: string,
    btnText: string,
    dialogTitle: string,
    dialogText: string,
  ) {
    if (this.dialogService) {
      const config: ODialogConfig = {
        icon: icon,
        okButtonText: btnText
      };
      this.dialogService.info(dialogTitle, dialogText, config);
    }
  }

  newSubmit() {

    let arrayErrores: any [] = [];
    const getFieldValues = this.formToyEdit.getFieldValues(['photo','name', 'description', 'price', 'email', 'longitude', 'latitude','category','status']);

    let errorPhoto = "ERROR_PHOTO_VALIDATION";
    let errorName = "ERROR_NAME_VALIDATION";
    let errorDescription = "ERROR_DESCRIPTION_VALIDATION";
    let errorPrice = "ERROR_PRICE_VALIDATION";
    let errorNegativePrice = "ERROR_NEGATIVE_PRICE_VALIDATION";
    let errorHigherThanTenMillionPrice = "ERROR_HIGHER_MILLION_VALIDATION";
    let errorEmail = "ERROR_EMAIL_VALIDATION";
    let errorLocation = "ERROR_LOCATION_VALIDATION";
    let errorCategory = "ERROR_CATEGORY_VALIDATION";
    let errorStatus = "ERROR_STATUS_VALIDATION";
    var regExpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');

    if(getFieldValues.photo === undefined  ){
      arrayErrores.push(this.translate.get(errorPhoto));
    }
    if(getFieldValues.name === undefined || getFieldValues.name.trim() === ""){
      arrayErrores.push(this.translate.get(errorName));
    }
    if(getFieldValues.description === undefined || getFieldValues.description.trim() === ""){
      arrayErrores.push(this.translate.get(errorDescription));
    }
    if(getFieldValues.price === undefined){
      arrayErrores.push(this.translate.get(errorPrice));
    }
    if(getFieldValues.price < 0){
      arrayErrores.push(this.translate.get(errorNegativePrice));
    }
    if(getFieldValues.price > 9999999){
      arrayErrores.push(this.translate.get(errorHigherThanTenMillionPrice));
    }
    if(getFieldValues.email === undefined || getFieldValues.email.trim() === "" || !regExpEmail.test(getFieldValues.email.trim())){
      arrayErrores.push(this.translate.get(errorEmail));
    }
    if(getFieldValues.longitude === undefined || getFieldValues.latitude === undefined){
      this.isMapLatLongSelected = false;
      arrayErrores.push(this.translate.get(errorLocation));
    }
    if(getFieldValues.category === undefined){
      arrayErrores.push(this.translate.get(errorCategory));
    }
    if(getFieldValues.status === undefined){
      arrayErrores.push(this.translate.get(errorStatus));
    }
    if(arrayErrores.length > 0 ) {
      let stringErrores = "";
      for(let i = 0; i < arrayErrores.length; i++){
        stringErrores += "</br>" + (arrayErrores[i] + "</br>");
      }
      this.showCustom("error", "Ok", this.translate.get("COMPLETE_FIELDS_VALIDATION"), stringErrores);
    }else{
      this.formToyEdit.update();
    }
  }

}
