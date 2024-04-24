import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToysRoutingModule } from './toys-routing.module';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { ToysNewComponent } from './toys-new/toys-new.component';


@NgModule({
  declarations: [
    ToysNewComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    ToysRoutingModule
  ]
})
export class ToysModule { }
