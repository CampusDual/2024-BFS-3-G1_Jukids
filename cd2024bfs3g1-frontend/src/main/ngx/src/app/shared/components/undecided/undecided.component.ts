import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OGridComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'app-undecided',
  templateUrl: './undecided.component.html',
  styleUrls: ['./undecided.component.scss']
})
export class UndecidedComponent implements OnInit {
  
  public isReserved: boolean = false;
  public baseUrl: string;
  @ViewChild('reservedGrid') reservedGrid: OGridComponent;
  
  constructor(
    private router: Router,){}
  
  ngOnInit(): void {
    this.baseUrl = window.location.origin;
    if (this.baseUrl.includes('localhost')) {
      this.baseUrl = 'http://localhost:8080';
    }
  }

  hasReserved(){
    (this.reservedGrid.dataArray.length == 0) ? (this.isReserved = false): (this.isReserved = true);
  }

  public openDetail(data: any): void {
    // Aquí redirigimos a la ruta de detalle de juguete y pasamos el ID como parámetro
    this.router.navigate(["./main/user-profile/buylist/toysDetail", data]);
  }
  public pay(toyid: any){
    this.router.navigate(["./main/toys/toysDetail/toysBuy", toyid]);
  }


}
