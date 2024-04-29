import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { ToysRoutingModule } from './toys-routing.module';
import { ToysHomeComponent } from './toys-home/toys-home.component';
import { ToysNewComponent } from './toys-new/toys-new.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PopUpMapComponent } from 'src/app/shared/components/pop-up-map/pop-up-map.component';

@NgModule({
  declarations: [
    ToysHomeComponent,
    ToysNewComponent,
    PopUpMapComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    ToysRoutingModule,
    SharedModule
  ]
})
export class ToysModule { }
