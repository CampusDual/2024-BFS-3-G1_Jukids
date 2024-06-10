import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { ToysRoutingModule } from './toys-routing.module';
import { ToysHomeComponent } from './toys-home/toys-home.component';
import { ToysNewComponent } from './toys-new/toys-new.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToysShippingComponent } from './toys-detail/toys-shipping/toys-shipping.component';
import { LoginModule } from 'src/app/login/login.module';

@NgModule({
  declarations: [
    ToysHomeComponent,
    ToysNewComponent,
    ToysShippingComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    ToysRoutingModule,
    SharedModule,
    LoginModule
  ]
})
export class ToysModule { }
