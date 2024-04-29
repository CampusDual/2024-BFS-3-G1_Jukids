import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ServiceResponse } from 'ontimize-web-ngx';
import { Observable, Subject, Subscriber, from, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ToysMapService {

  private location$ = new Subject<{ latitude: number, longitude: number }>;
  private location =  this.location$.asObservable();
  
  constructor() { 
   }

  public setLocation(latitude: number, longitude: number){
    this.location$.next({latitude: latitude, longitude: longitude});
  }

  public getLocation():Observable<any>{
    return this.location;
  }

}
