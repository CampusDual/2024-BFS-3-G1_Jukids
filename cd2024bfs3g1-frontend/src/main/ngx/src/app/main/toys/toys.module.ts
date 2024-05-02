import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { ToysRoutingModule } from './toys-routing.module';
import { ToysHomeComponent } from './toys-home/toys-home.component';
import { ToysNewComponent } from './toys-new/toys-new.component';


@NgModule({
  declarations: [
    ToysHomeComponent,
    ToysNewComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    ToysRoutingModule
  ]
})
export class ToysModule { }
