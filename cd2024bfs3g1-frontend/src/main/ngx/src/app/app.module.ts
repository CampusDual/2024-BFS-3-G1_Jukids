import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { APP_CONFIG, ONTIMIZE_MODULES, ONTIMIZE_PROVIDERS, OntimizeWebModule, O_MAT_ERROR_OPTIONS } from 'ontimize-web-ngx';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONFIG } from './app.config';
import { MainService } from './shared/services/main.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToysDetailComponent } from './main/toys/toys-detail/toys-detail.component';
import { ToysModule } from './main/toys/toys.module';
import { MyToyDetailComponent } from './main/user-profile/my-toy-detail/my-toy-detail.component';
import { UserProfileModule } from './main/user-profile/user-profile.module';

// Standard providers...
// Defining custom providers (if needed)...
export const customProviders: any = [
  MainService,
  { provide: O_MAT_ERROR_OPTIONS, useValue: { type: 'lite' } },
  { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OntimizeWebModule.forRoot(CONFIG),
    OntimizeWebModule,
    AppRoutingModule,
    // ToysModule,
    // UserProfileModule,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: APP_CONFIG, useValue: CONFIG },
    ONTIMIZE_PROVIDERS,
    ...customProviders
  ],
})
export class AppModule { }
