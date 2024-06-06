import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { UserProfileHomeComponent } from './user-profile-home/user-profile-home.component';
import { UserProfileToylistComponent } from './user-profile-toylist/user-profile-toylist.component';
import { EditToyComponent } from './edit-toy/edit-toy.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserPurchasedToylistComponent } from './user-profile-buylist/user-profile-buylist.component';
import { UserProfileRatingsComponent } from './user-profile-ratings/user-profile-ratings.component';

@NgModule({
  declarations: [
    UserProfileHomeComponent,
    UserProfileToylistComponent,
    UserPurchasedToylistComponent,
    EditToyComponent,
    UserProfileRatingsComponent

  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    UserProfileRoutingModule,
    SharedModule
    ]
})
export class UserProfileModule { }
