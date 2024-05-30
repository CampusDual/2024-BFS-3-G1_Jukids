import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToysHomeComponent } from './toys-home/toys-home.component';
import { ToysNewComponent } from './toys-new/toys-new.component';
import { ToysDetailComponent } from './toys-detail/toys-detail.component';
import { ToysShippingComponent } from './toys-detail/toys-shipping/toys-shipping.component';

const routes: Routes = [{
  path: '',
  component: ToysHomeComponent
},
{
  path: "new",
  component: ToysNewComponent
},
{
  path: "toysDetail/:toyid",
  component: ToysDetailComponent
},
{
  path: "toysDetail/toysBuy/:toyid",
  component: ToysShippingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToysRoutingModule { }
