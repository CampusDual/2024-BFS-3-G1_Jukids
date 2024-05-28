import { Injectable, Injector } from "@angular/core";
import { AuthService, Codes, LoginStorageService, ORemoteConfigurationService, Observable, OntimizeAuthService } from "ontimize-web-ngx";
import { from } from "rxjs";

@Injectable()
export class JukidsAuthService extends OntimizeAuthService {

    private loginStoreService: LoginStorageService;

    constructor(injector: Injector) {
        console.log('JukidsAuthService instanciado');
        super(injector);
        this.loginStoreService = injector.get(LoginStorageService);

    }
    // logout(): Observable<any> {
    //     console.log("JUKIDSERVICE: logout");
    //     return super.logout();
    // }


    public logout(): Observable<any> {
        this.onLogout.next(null);
        const sessionInfo = this.loginStoreService.getSessionInfo();
        const dataObservable: Observable<any> = new Observable(innerObserver => {
            this.retrieveAuthService().then(service => {
                service.endsession(sessionInfo.user, sessionInfo.id).subscribe(resp => {
                    const remoteConfigService = this.injector.get(ORemoteConfigurationService);
                    remoteConfigService.finalize().subscribe(() => {
                        this.onLogoutSuccess(resp);
                        innerObserver.next();
                        innerObserver.complete();
                    });
                }, error => {
                    this.onLogoutError(error);
                    innerObserver.error(error);
                });
            });
        });
        return from(dataObservable.toPromise());
    }

    redirectLogin(sessionExpired: boolean = false) {
        const arg = {};
        arg[Codes.SESSION_EXPIRED_KEY] = sessionExpired;
        const extras = {};
        extras[Codes.QUERY_PARAMS] = arg;
    }


    //Al realizar el logout modificar el redirect para que no redireccione y limpie los datos.

}


