import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { OntimizeEEService, AppConfig } from 'ontimize-web-ngx';
import { Observable } from 'rxjs';
import { JukidsAuthService } from './jukids-auth.service';

@Injectable()
export class MainService extends OntimizeEEService {
  private appConfig: AppConfig;

  constructor(
    private jukidsAuthService: JukidsAuthService,
    protected injector: Injector
  ) {
    super(injector);
    this.appConfig = injector.get(AppConfig);
  }

  public buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + this.jukidsAuthService.getSessionInfo().id
    });
    return headers;
  }

  public getUserInfo() : Observable<any> {
    const options = { headers: this.buildHeaders() };
    const requestBody = {};
    return this.httpClient.post(
      this._appConfig.apiEndpoint + '/users/loginUser/search',
      requestBody,
      options);
  }
}
