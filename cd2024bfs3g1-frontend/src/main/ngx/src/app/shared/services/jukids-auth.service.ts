import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, Codes, IAuthService, LoginStorageService, ORemoteConfigurationService, Observable, OntimizeAuthService, OntimizeService, PermissionsService, SessionInfo } from "ontimize-web-ngx";
import { Config } from "protractor";
import { combineLatest, from } from "rxjs";

@Injectable()
export class JukidsAuthService extends OntimizeAuthService {
    private jukids_router: Router;


    constructor(
        injector: Injector
    ) {
        console.log('JukidsAuthService instanciado');
        super(injector);
        this.jukids_router = this.injector.get(Router);
    }


    redirectLogin(sessionExpired: boolean = false) {
        const arg = {};
        arg[Codes.SESSION_EXPIRED_KEY] = sessionExpired;
        const extras = {};
        extras[Codes.QUERY_PARAMS] = arg;
        // this.jukids_router.navigate(["/main/toys"], extras);
        this.jukids_router.navigate(["/main/toys"], extras)
            .then(() => {
                window.location.reload();
            });

    }

}


