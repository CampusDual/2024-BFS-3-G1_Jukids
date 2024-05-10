import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileToylistComponent } from './user-profile-toylist/user-profile-toylist.component';
import { MyToyDetailComponent } from './my-toy-detail/my-toy-detail.component';
import { UserProfileHomeComponent } from './user-profile-home/user-profile-home.component';
import { EditToyComponent } from './edit-toy/edit-toy.component';

const routes: Routes = [
  // { path: '', component: UserProfileHomeComponent },
  { path: '', component: UserProfileToylistComponent },
  { path: 'toydetail/:toyid', component: MyToyDetailComponent },
  { path: 'edit-toy/:toyid', component: EditToyComponent }
] 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
