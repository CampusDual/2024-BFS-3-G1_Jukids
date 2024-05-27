import { Injectable, Injector } from "@angular/core";
import { AuthService, Codes, Observable, OntimizeAuthService } from "ontimize-web-ngx";

@Injectable()
export class JukidsAuthService extends OntimizeAuthService {

    constructor(injector: Injector) {
        console.log('JukidsAuthService instanciado');
        super(injector);
        
    }
    logout(): Observable<any> {
        console.log("JUKIDSERVICE: logout");
        return super.logout();
    }

    redirectLogin(sessionExpired: boolean = false) {
        const arg = {};
        arg[Codes.SESSION_EXPIRED_KEY] = sessionExpired;
        const extras = {};
        extras[Codes.QUERY_PARAMS] = arg;
    }


    //Al realizar el logout modificar el redirect para que no redireccione y limpie los datos.

}


