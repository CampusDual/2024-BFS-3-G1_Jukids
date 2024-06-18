import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileToylistComponent } from './user-profile-toylist/user-profile-toylist.component';
import { EditToyComponent } from './edit-toy/edit-toy.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserProfileHomeComponent } from './user-profile-home/user-profile-home.component';
import { UserPurchasedToylistComponent } from './user-profile-buylist/user-profile-buylist.component';
import { UserProfileRatingsComponent } from './user-profile-ratings/user-profile-ratings.component';
import { ToysDetailComponent } from '../toys/toys-detail/toys-detail.component';
import { UserProfileChatsComponent } from './user-profile-chats/user-profile-chats.component';

const routes: Routes = [
  { path: '', component: UserProfileHomeComponent },
  { path: 'toylist', component: UserProfileToylistComponent },
  { path: 'buylist', component: UserPurchasedToylistComponent },
  { path: 'ratings', component: UserProfileRatingsComponent},
  { path: 'toylist/toysDetail/:toyid', component: ToysDetailComponent },
  { path: 'buylist/toysDetail/:toyid', component: ToysDetailComponent },
  { path: 'toylist/:toyid', component: EditToyComponent },
  { path: 'edit-toy/:toyid', component: EditToyComponent },
  { path: 'chats', component: UserProfileChatsComponent },
  { path: 'edit-toy/:toyid', component: EditToyComponent },
  { path: 'edit-user', component: EditUserComponent },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
