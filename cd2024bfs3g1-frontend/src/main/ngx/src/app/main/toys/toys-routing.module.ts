import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToysHomeComponent } from './toys-home/toys-home.component';
import { ToysNewComponent } from './toys-new/toys-new.component';

const routes: Routes = [{
  path: '',
  component: ToysHomeComponent
},
{
    path: "new",
    component: ToysNewComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToysRoutingModule { }
