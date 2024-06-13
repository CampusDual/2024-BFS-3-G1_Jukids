import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { Codes, OntimizeAuthService } from "ontimize-web-ngx";

@Injectable()
export class JukidsAuthService extends OntimizeAuthService {
    private jukids_router: Router;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.jukids_router = this.injector.get(Router);
    }


    redirectLogin(sessionExpired: boolean = false) {
        const arg = {};
        arg[Codes.SESSION_EXPIRED_KEY] = sessionExpired;
        const extras = {};
        extras[Codes.QUERY_PARAMS] = arg;
        // this.jukids_router.navigate(["/"], extras);
        this.jukids_router.navigate(["/"], extras)
            .then(() => {
                window.location.reload();
            });

    }

}


