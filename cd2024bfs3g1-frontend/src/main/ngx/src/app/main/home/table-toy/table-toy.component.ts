import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OntimizeService } from 'ontimize-web-ngx';
import { calculateDistanceFunction } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-table-toy',
  templateUrl: './table-toy.component.html',
  styleUrls: ['./table-toy.component.css']
})
export class TableToyComponent {
  private latComprador = 42.240599;
  private longComprador = -8.713697;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private ontimizeService: OntimizeService,
    protected dialogService: DialogService
  ) {
    const conf = this.ontimizeService.getDefaultServiceConfiguration('toys');
    this.ontimizeService.configureService(conf);
  }
  ngOnInit() {
  }

  
    calculateDistance(rowData: Array<any>): number {    
    const R: number = 6371; // Radio de la Tierra en kilómetros
    let lat1: number = this.latComprador;
    let lon1: number = this.longComprador;

    let lat2: number = rowData['latitude'];
    let lon2: number = rowData['longitude'];

    console.log(lat1);
    console.log(lat2);
    console.log(lon1);
    console.log(lon2);

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
}
