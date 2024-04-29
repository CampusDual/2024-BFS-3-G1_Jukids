import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToysRoutingModule } from './toys-routing.module';
import { ToysHomeComponent } from './toys-home/toys-home.component';
import { ToyDistanceRenderComponent } from './toys-home/toy-distance-render/toy-distance-render.component';


@NgModule({
  declarations: [
    ToysHomeComponent,
    ToyDistanceRenderComponent
  ],
  imports: [
    CommonModule,
    ToysRoutingModule
  ]
})
export class ToysModule { }
