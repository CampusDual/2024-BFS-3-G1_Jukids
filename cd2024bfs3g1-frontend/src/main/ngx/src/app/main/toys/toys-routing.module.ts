import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToysHomeComponent } from './toys-home/toys-home.component';

const routes: Routes = [{
  path: '',
  component: ToysHomeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToysRoutingModule { }
