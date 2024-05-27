import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { ToysRoutingModule } from './toys-routing.module';
import { ToysHomeComponent } from './toys-home/toys-home.component';
import { ToysNewComponent } from './toys-new/toys-new.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationMapComponent } from 'src/app/shared/components/location-map/location-map.component';
import { ToysDetailComponent } from './toys-detail/toys-detail.component';
import { OChartModule } from 'ontimize-web-ngx-charts';


@NgModule({
  declarations: [
    ToysHomeComponent,
    ToysNewComponent,
    // LocationMapComponent,
    ToysDetailComponent,
    
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    ToysRoutingModule,
    SharedModule,
    OChartModule
  ]
  // exports: [
  //   ToysDetailComponent
  // ]
})
export class ToysModule { }
