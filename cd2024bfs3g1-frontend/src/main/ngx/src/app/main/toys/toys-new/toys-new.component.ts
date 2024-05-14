import { Component, ViewChild, Inject, OnInit} from '@angular/core';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { ORealInputComponent, OntimizeService,OUserInfoService, AuthService, OEmailInputComponent } from 'ontimize-web-ngx';
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

  @ViewChild('latitude') protected lat: ORealInputComponent;
  @ViewChild('longitude') protected lon: ORealInputComponent;
  @ViewChild('usr_id') protected usr_id: ORealInputComponent;
  @ViewChild('usr_email') protected usr_email: OEmailInputComponent;

  constructor(
    private router: Router,
    private ontimizeService: OntimizeService,
    private toysMapService: ToysMapService,
    private authService: AuthService,
    @Inject(MainService) private mainService: MainService,
  ) {

    this.toyService = this.authService.isLoggedIn() ? 'toyowner' : 'toys';

  }

  ngOnInit() {
    const serviceConfig = this.ontimizeService.getDefaultServiceConfiguration(this.toyService);
    this.ontimizeService.configureService(serviceConfig);
    //Se escuchan los cambios del servicio
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    });

    if (this.authService.isLoggedIn()) {  
      this.mainService.getUserInfo().subscribe((data)=>{
        const usr = data.data.usr_login;
        this.usr_email.setValue(usr);
      })
   }
  }

  handleMapClick(e) {
    let latitude = this.location.latitude;
    let longitude = this.location.longitude;

    this.lat.setValue(latitude);
    this.lon.setValue(longitude);
  }

  insertRedirect(){
    const self = this;
      self.router.navigate([this.redirect]);
  }
}
