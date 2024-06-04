import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { FilterComponent } from './components/filters/filters.component';
import { HomeToolbarComponent } from './components/home-toolbar/home-toolbar.component';
import { OMapModule } from 'ontimize-web-ngx-map';
import { LocationMapComponent } from './components/location-map/location-map.component';
import { StripeComponent } from './components/stripe/stripe.component';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { CheckoutComponent } from './components/stripe/checkout/checkout.component';
import { SurveyComponent } from './components/survey/survey.component';

@NgModule({
  imports: [
    OntimizeWebModule,
    OMapModule,
    NgxStripeModule.forRoot(environment.stripe_public_key),
    CommonModule
  ],
  declarations: [
    FilterComponent,
    HomeToolbarComponent,
    LocationMapComponent,
    HomeToolbarComponent,
    StripeComponent,
    CheckoutComponent,
    SurveyComponent
  ],
  exports: [
    CommonModule,
    FilterComponent,
    HomeToolbarComponent,
    OMapModule,
    LocationMapComponent,
    OMapModule,
    StripeComponent
  ]
})
export class SharedModule {


 }
