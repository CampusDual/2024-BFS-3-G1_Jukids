import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileToylistComponent } from './user-profile-toylist/user-profile-toylist.component';
import { EditToyComponent } from './edit-toy/edit-toy.component';
import { UserProfileHomeComponent } from './user-profile-home/user-profile-home.component';
import { UserPurchasedToylistComponent } from './user-profile-buylist/user-profile-buylist.component';

const routes: Routes = [
  { path: '', component: UserProfileHomeComponent },
  { path: 'toylist', component: UserProfileToylistComponent },
  { path: 'buylist', component: UserPurchasedToylistComponent },
  { path: 'toylist/:toyid', component: EditToyComponent },
  { path: 'edit-toy/:toyid', component: EditToyComponent }
 
] 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
