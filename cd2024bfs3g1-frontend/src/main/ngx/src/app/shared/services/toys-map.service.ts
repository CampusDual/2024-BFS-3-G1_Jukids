import { Injectable, Injector } from '@angular/core';
import { Observable, Subject, Subscriber, from, of } from 'rxjs';

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
