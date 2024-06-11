import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OMapModule } from 'ontimize-web-ngx-map';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { FilterComponent } from './components/filters/filters.component';
import { HomeToolbarComponent } from './components/home-toolbar/home-toolbar.component';
import { LocationMapComponent } from './components/location-map/location-map.component';
import { StripeComponent } from './components/stripe/stripe.component';
import { CheckoutComponent } from './components/stripe/checkout/checkout.component';
import { ChatComponent } from './components/chat/chat.component';
import { environment } from 'src/environments/environment';
import { SurveyComponent } from './components/survey/survey.component';
import { NgxStripeModule } from 'ngx-stripe';
import { SocketIoConfig } from 'ngx-socket-io';

//Socket io configuration
const config: SocketIoConfig = { url: environment.apiEndpoint, options: {} };

import { ToysDetailComponent } from '../main/toys/toys-detail/toys-detail.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    OntimizeWebModule,
    OMapModule,
    NgxStripeModule.forRoot(environment.stripe_public_key),
    CommonModule,
    RouterModule
  ],
  declarations: [
    FilterComponent,
    HomeToolbarComponent,
    LocationMapComponent,
    HomeToolbarComponent,
    StripeComponent,
    CheckoutComponent,
    SurveyComponent,
    ChatComponent,
    ToysDetailComponent
  ],
  exports: [
    CommonModule,
    FilterComponent,
    HomeToolbarComponent,
    OMapModule,
    LocationMapComponent,
    OMapModule,
    StripeComponent,
    ChatComponent
  ]
})
export class SharedModule {


 }
