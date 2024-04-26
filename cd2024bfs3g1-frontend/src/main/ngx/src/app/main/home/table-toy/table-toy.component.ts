import { Component, Inject } from '@angular/core';
import { OntimizeService } from 'ontimize-web-ngx';
import { Subscription } from 'rxjs';
import { ToysMapService } from 'src/app/shared/services/toys-map.service';
import { calculateDistanceFunction } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-table-toy',
  templateUrl: './table-toy.component.html',
  styleUrls: ['./table-toy.component.css']
})

export class TableToyComponent {
  private latComprador = 42.240599;
  private longComprador = -8.713697;
  // public  calculateDistance = this.toysMapService.calculateDistanceFunction;

  private location: any;

  constructor(    
    private ontimizeService: OntimizeService,
    private toysMapService: ToysMapService    
  ) 
  {
    const conf = this.ontimizeService.getDefaultServiceConfiguration('toys');
    this.ontimizeService.configureService(conf);

  }

  ngOnInit() {
    this.toysMapService.location.subscribe(data => {
      this.location = data;
    });
    this.toysMapService.setLocation(this.latComprador, this.longComprador);    
    console.log("latitud table-toy: " + this.location);
  }

  calculateDistance(rowData: Array<any>): number {
    const R: number = 6371; // Radio de la Tierra en kilómetros
    
    // console.log("latitud table-toy: " + this.location.latitude);
    // let lat1:number = this.toysMapService.getLatBuyerNum();  
    let lat1:number = this.latComprador;    
    let lon1: number = this.longComprador;

    let lat2: number = rowData['latitude'];
    let lon2: number = rowData['longitude'];

    function deg2rad(deg: number): number {
      return deg * (Math.PI / 180);
    }

    let dLat: number = deg2rad(lat2 - lat1);
    let dLon: number = deg2rad(lon2 - lon1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;
    return Math.round(distance * 100.0) / 100.0; // Redondear a 2 decimales
  }



  hazAlgo(rowData: Array<any>){
    console.log("latitud table-toy: " + typeof(rowData['latitude']));

    alert(calculateDistanceFunction(this.location.latitude, this.location.longitude, rowData));
  
  }

  cal(){
    let array = document.querySelectorAll('.km');
    array.forEach((element)=>{
    console.log (element)
    });
  
  }
}

