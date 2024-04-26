import { NgModule } from '@angular/core';
import {RegisterComponent} from './register.component'
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
