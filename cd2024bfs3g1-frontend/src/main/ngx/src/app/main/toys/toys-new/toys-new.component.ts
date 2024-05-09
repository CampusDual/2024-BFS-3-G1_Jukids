import { Component, ViewChild, Inject, OnInit} from '@angular/core';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { ORealInputComponent, OntimizeService,OUserInfoService, AuthService } from 'ontimize-web-ngx';
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

  @ViewChild('NewToy') protected formToy: any;
  @ViewChild('latitude') protected lat: ORealInputComponent;
  @ViewChild('longitude') protected lon: ORealInputComponent;
  @ViewChild('usr_id') protected usr_id: ORealInputComponent;

  constructor(
    private router: Router,
    private ontimizeService: OntimizeService,
    private toysMapService: ToysMapService,
    private authService: AuthService,
    @Inject(MainService) private mainService: MainService,
  ) {

  //Configuración del servicio para poder ser usado
  const conf = this.ontimizeService.getDefaultServiceConfiguration('toys');
  this.ontimizeService.configureService(conf);
  }

  ngOnInit() {
    //Se escuchan los cambios del servicio
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    });

   /* if (this.authService.isLoggedIn()) {  
      this.mainService.getUserInfo().subscribe((data)=>{
        const usr = data.data.usr_id;
        console.log(usr);
        this.usr_id.setValue(usr);
      })
  }*/


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
