import { Component, ViewChild } from '@angular/core';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { OFormComponent, ORealInputComponent, OntimizeService } from 'ontimize-web-ngx';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toys-new',
  templateUrl: './toys-new.component.html',
  styleUrls: ['./toys-new.component.scss']
})
export class ToysNewComponent {

  private location: any;
  subscription: Subscription;
  private redirect = '/toys';

  isMapLatLongSelected: boolean = false;


  @ViewChild('NewToy') protected formToy: OFormComponent;
  @ViewChild('latitude') protected lat: ORealInputComponent;
  @ViewChild('longitude') protected lon: ORealInputComponent;


  
 
  constructor(
    private router: Router,
    private ontimizeService: OntimizeService,
    private toysMapService: ToysMapService
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
  }

  handleMapClick(e) {
    let latitude = this.location.latitude;
    let longitude = this.location.longitude;

    this.lat.setValue(latitude);
    this.lon.setValue(longitude);

    this.isMapLatLongSelected = true;
    
  }


  newSubmit() {

    //Valores del formulario
    const getFieldValues: any = this.formToy.getFieldValues(['photo','name', 'description', 'price', 'email', 'longitude', 'latitude']);
    
    //TODO: En base a las corroboraciones de los campos. Agregar las excepciones en un array.
    //Al mostrar en el dialog. Itear cada elemento del array y lo muestre.
    //Si hay un error, mostrarlo en el dialog
    //Si no hay valores en el array, se ejecuta el this.formToy.insert()




    
    // if(this.lat.isEmpty() || this.lon.isEmpty()){ 
    //   alert('Please select a location on the map');
    // } else {
    //   console.log(
    //     this.formToy.insert()
    //   )
    // }
  }

  insertRedirect() {
    const self = this;
    self.router.navigate([this.redirect]);
  }

}

