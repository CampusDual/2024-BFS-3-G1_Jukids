//import { Injectable } from '@angular/core';
import { Injectable, Injector } from '@angular/core';
import { OntimizeEEService } from 'ontimize-web-ngx';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerPositionService extends OntimizeEEService {

  constructor(protected injector: Injector) {
    super(injector);
  }



}
