import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileToylistComponent } from './user-profile-toylist/user-profile-toylist.component';
import { MyToyDetailComponent } from './my-toy-detail/my-toy-detail.component';
import { UserProfileHomeComponent } from './user-profile-home/user-profile-home.component';

const routes: Routes = [
  // { path: '', component: UserProfileHomeComponent },
  { path: '', component: UserProfileToylistComponent },
  { path: 'toydetail', component: MyToyDetailComponent }

//   { path: '', component: UserProfileHomeComponent },
//   { 
//     path: 'toylist', 
//     component: UserProfileToylistComponent,
//     children: [
//      { path: 'toydetail',
//       component: MyToyDetailComponent}
//     ] 
//   },
// ];

] 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
