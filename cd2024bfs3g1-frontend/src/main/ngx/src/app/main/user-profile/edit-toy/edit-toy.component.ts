import { Component, OnInit, ViewChild } from '@angular/core';
import { ORealInputComponent, OntimizeService } from 'ontimize-web-ngx';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';

@Component({
  selector: 'app-edit-toy',
  templateUrl: './edit-toy.component.html',
  styleUrls: ['./edit-toy.component.scss']
})
export class EditToyComponent implements OnInit {
  private location: any;
  public longitude;
  public latitude;
  @ViewChild('latitude') protected lat: ORealInputComponent;
  @ViewChild('longitude') protected lon: ORealInputComponent;

  constructor(private ontimizeService: OntimizeService, private toysMapService: ToysMapService){

  }
  
  ngOnInit() {
    this.toysMapService.getLocation().subscribe(data => {
      this.location = data;
    }); 
  }

  onFormDataLoaded(data: any) {

    console.log("hola")
    console.log(this.lat.getValue())
    console.log(this.lon.getValue())
    this.toysMapService.setLocation(this.lat.getValue(), this.lon.getValue())
  }

  handleMapClick(e) {
    let latitude = this.location.latitude;
    let longitude = this.location.longitude;

    this.lat.setValue(latitude);
    this.lon.setValue(longitude);
  }
}
