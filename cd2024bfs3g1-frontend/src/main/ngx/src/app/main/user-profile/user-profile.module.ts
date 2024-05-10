import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { UserProfileHomeComponent } from './user-profile-home/user-profile-home.component';
import { UserProfileToylistComponent } from './user-profile-toylist/user-profile-toylist.component';
import { MyToyDetailComponent } from './my-toy-detail/my-toy-detail.component';



@NgModule({
  declarations: [
    UserProfileHomeComponent,
    UserProfileToylistComponent,
    MyToyDetailComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    UserProfileRoutingModule
  ]
})
export class UserProfileModule { }
