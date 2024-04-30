import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { ToysRoutingModule } from './toys-routing.module';
import { ToysHomeComponent } from './toys-home/toys-home.component';
import { ToysNewComponent } from './toys-new/toys-new.component';
import { OMapModule } from "ontimize-web-ngx-map";


@NgModule({
  declarations: [
    ToysHomeComponent,
    ToysNewComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    ToysRoutingModule,
    OMapModule
  ]
})
export class ToysModule { }
