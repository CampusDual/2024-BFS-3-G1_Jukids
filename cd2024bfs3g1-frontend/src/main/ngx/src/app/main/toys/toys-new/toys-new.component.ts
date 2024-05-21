import { Component, ViewChild, Inject, OnInit} from '@angular/core';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { DialogService,  ODialogConfig, OFormComponent, ORealInputComponent, OTranslateService, OntimizeService } from 'ontimize-web-ngx';
import { OUserInfoService, AuthService, OEmailInputComponent } from 'ontimize-web-ngx';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-toys-new',
  templateUrl: './toys-new.component.html',
  styleUrls: ['./toys-new.component.scss']
})
export class ToysNewComponent implements OnInit{
  private location: any;
  subscription:Subscription;
  private redirect = '/toys';
  public toyService: string;

  isMapLatLongSelected: boolean = true;
  public locationSelected = false;

  @ViewChild('NewToy') protected formToy: OFormComponent;
  @ViewChild('latitude') protected lat: ORealInputComponent;
  @ViewChild('longitude') protected lon: ORealInputComponent;
  @ViewChild('usr_email') protected usr_email: OEmailInputComponent;

  constructor(
    private router: Router,
    private ontimizeService: OntimizeService,
    private toysMapService: ToysMapService,
    protected dialogService: DialogService,
    private translate: OTranslateService,
    private authService: AuthService,
    @Inject(MainService) private mainService: MainService
  ) {

    this.toyService = this.authService.isLoggedIn() ? 'toyowner' : 'toys';
   //Configuración del servicio para poder ser usado
   const conf = this.ontimizeService.getDefaultServiceConfiguration('toys');
   this.ontimizeService.configureService(conf);
  }

  ngOnInit() {
    const serviceConfig = this.ontimizeService.getDefaultServiceConfiguration(this.toyService);
    this.ontimizeService.configureService(serviceConfig);
    //Se escuchan los cambios del servicio
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;

    });

    setTimeout(() => {
      this.mainService.getUserInfo().subscribe((data)=>{
          const usr = data.data.usr_login;
          this.usr_email.setValue(usr);
      });
    }, 100);
  }

  handleMapClick(e) {
    let latitude = this.location.latitude;
    let longitude = this.location.longitude;

    this.lat.setValue(latitude);
    this.lon.setValue(longitude);

    this.locationSelected = true;
    this.isMapLatLongSelected = true;
  }

  newSubmit() {

    let arrayErrores: any [] = [];
    const getFieldValues = this.formToy.getFieldValues(['photo','name', 'description', 'price', 'email', 'longitude', 'latitude','category']);

    let errorPhoto = "ERROR_PHOTO_VALIDATION";
    let errorName = "ERROR_NAME_VALIDATION";
    let errorDescription = "ERROR_DESCRIPTION_VALIDATION";
    let errorPrice = "ERROR_PRICE_VALIDATION";
    let errorNegativePrice = "ERROR_NEGATIVE_PRICE_VALIDATION";
    let errorHigherThanTenMillionPrice = "ERROR_HIGHER_MILLION_VALIDATION"
    let errorEmail = "ERROR_EMAIL_VALIDATION";
    let errorLocation = "ERROR_LOCATION_VALIDATION";
    var regExpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
    let errorCategory = "ERROR_CATEGORY_VALIDATION";
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
    if(getFieldValues.category===undefined){
      arrayErrores.push(this.translate.get(errorCategory));
    }
    if(arrayErrores.length > 0 ) {
      let stringErrores = "";
      for(let i = 0; i < arrayErrores.length; i++){
        stringErrores += "</br>" + (arrayErrores[i] + "</br>");
      }
      this.showCustom("error", "Ok", this.translate.get("COMPLETE_FIELDS_VALIDATION"), stringErrores);
    }else{
      this.formToy.insert();
    }
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

  insertRedirect(){
    const self = this;
      self.router.navigate([this.redirect]);
  }
  }

