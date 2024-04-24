import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToysNewComponent } from './toys-new/toys-new.component';

const routes: Routes = [
  {
    path: "new",
    component: ToysNewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToysRoutingModule { }
