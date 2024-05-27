import { Injectable, Injector } from "@angular/core";
import { OntimizeAuthService } from "ontimize-web-ngx";

@Injectable()

export class JukidsAuthService extends OntimizeAuthService {
    

    constructor(injector: Injector) {
        super(injector);
    }

        
    redirectLogin(sessionExpired?: boolean): void {
        this.redirectLogin(sessionExpired);        
    }


    //Al realizar el logout modificar el redirect para que no redireccione y limpie los datos.

}


