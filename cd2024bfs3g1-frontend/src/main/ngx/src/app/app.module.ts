import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { APP_CONFIG, ONTIMIZE_PROVIDERS, OntimizeWebModule, O_MAT_ERROR_OPTIONS, O_AUTH_SERVICE } from 'ontimize-web-ngx';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONFIG } from './app.config';
import { MainService } from './shared/services/main.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JukidsAuthService } from './shared/services/jukids-auth.service';
import { SharedModule } from './shared/shared.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';




//Socket io configuration
const config: SocketIoConfig = { url: environment.socketIoEnpoint, options: {} };



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
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SocketIoModule.forRoot(config),
    SharedModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    JukidsAuthService,
    { provide: APP_CONFIG, useValue: CONFIG },
    { provide: O_AUTH_SERVICE, useValue: JukidsAuthService },
    ONTIMIZE_PROVIDERS,
    ...customProviders
  ],
})
export class AppModule { }
