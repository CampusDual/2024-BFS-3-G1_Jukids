import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { ToysRoutingModule } from './toys-routing.module';
import { ToysHomeComponent } from './toys-home/toys-home.component';
import { ToysNewComponent } from './toys-new/toys-new.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationMapComponent } from 'src/app/shared/components/location-map/location-map.component';
import { ToysDetailComponent } from './toys-detail/toys-detail.component';
import { ToysShippingComponent } from './toys-detail/toys-shipping/toys-shipping.component';

@NgModule({
  declarations: [
    ToysHomeComponent,
    ToysNewComponent,
    // LocationMapComponent,
    ToysDetailComponent,
    ToysShippingComponent,
    ToysDetailComponent,
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    ToysRoutingModule,
    SharedModule
  ]
  // exports: [
  //   ToysDetailComponent
  // ]
})
export class ToysModule { }
