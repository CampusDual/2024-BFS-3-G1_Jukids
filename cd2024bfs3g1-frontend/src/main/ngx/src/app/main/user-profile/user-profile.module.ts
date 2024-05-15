import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { UserProfileHomeComponent } from './user-profile-home/user-profile-home.component';
import { UserProfileToylistComponent } from './user-profile-toylist/user-profile-toylist.component';
import { EditToyComponent } from './edit-toy/edit-toy.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    UserProfileHomeComponent,
    UserProfileToylistComponent,
    EditToyComponent,
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    UserProfileRoutingModule,
    SharedModule
    ]
})
export class UserProfileModule { }
