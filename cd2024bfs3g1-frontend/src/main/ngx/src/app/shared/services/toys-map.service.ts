import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ServiceResponse } from 'ontimize-web-ngx';
import { Observable, Subject, Subscriber, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToysMapService {
  public latBuyer: number = 42.222222;
  public lngBuyer: number = -8.888888;

  private location$ = new Subject<{ latitude: number, longitude: number }>;
  location =  this.location$.asObservable();

  constructor() { 
    // this.setLocation( 42.222222, -8.888888);
   }

  public setLocation(latitude: number = this.latBuyer, longitude: number = this.lngBuyer){
    this.location$.next({latitude: latitude, longitude: longitude});
  }
  getLocation():Observable<any>{
    return this.location;
  }















  public setLatBuyer(value: number): void {
    this.latBuyer = value
  }

  public getLatBuyer(): Observable<number> {
    return of(this.latBuyer);
  }

  public getLatBuyerNum(): number {
    return this.latBuyer;
  }






  public setLngBuyer(value: number): void {
    this.lngBuyer = value
  }

  public getLngBuyer(): Observable<number> {
    return of(this.lngBuyer);
  }  

  public getLngBuyerNum(): number {
    return this.lngBuyer;
  }



  calculateDistanceFunction(rowData: Array<any>) {
    const R: number = 6371;

    let lat1:number = this.latBuyer;
    let lon1:number = this.lngBuyer;

    console.log("estamos en la funcion de servicio toys-map")

    let lat2: number = rowData['latitude'];
    let lon2: number = rowData['longitude'];

    console.log(lat1);
    console.log(lat2);
    console.log(lon1);
    console.log(lon2);

    let dLat: number = deg2rad(lat2 - lat1);
    let dLon: number = deg2rad(lon2 - lon1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;
    return Math.round(distance * 100.0) / 100.0; // Redondear a 2 decimales


    function deg2rad(deg: number) {
      return deg * (Math.PI / 180);
    }

  }

}
