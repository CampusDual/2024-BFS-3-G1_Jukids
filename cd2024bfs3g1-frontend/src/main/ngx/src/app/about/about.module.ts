import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { AboutJukidsComponent } from './about-jukids/about-jukids.component';


@NgModule({
  declarations: [
    AboutUsComponent,
    AboutJukidsComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule
  ]
})
export class AboutModule { }
