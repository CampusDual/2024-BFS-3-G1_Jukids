import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileToylistComponent } from './user-profile-toylist/user-profile-toylist.component';
import { EditToyComponent } from './edit-toy/edit-toy.component';
import { UserProfileHomeComponent } from './user-profile-home/user-profile-home.component';

const routes: Routes = [
  { path: '', component: UserProfileHomeComponent },
  { path: 'toylist', component: UserProfileToylistComponent },
  { path: 'toylist/:toyid', component: EditToyComponent },
  { path: 'edit-toy/:toyid', component: EditToyComponent },
  { path: 'purchased-toy/:toyid', component: EditToyComponent }
] 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
