import { NgModule } from '@angular/core';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { LocationMapComponent } from '../shared/components/location-map/location-map.component';

@NgModule({
  imports: [
    SharedModule,
    OntimizeWebModule,
    MainRoutingModule,    
  ],
  declarations: [
    MainComponent,
    //LocationMapComponent
  ]
})
export class MainModule { }
