import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";

declare let Keycloak: any;

interface UserInfo {
    name:string;
    given_name:string;
    family_name:string;
}

@Injectable()
export class KeycloakService implements CanActivate {
    static auth: any = {};

    static init(): Promise<any> {
        let keycloakAuth: any = new Keycloak('keycloak.json');
        KeycloakService.auth.loggedIn = false;

        return new Promise((resolve, reject) => {
            console.log("KeycloakService.init: ...");
            keycloakAuth.init({onLoad: 'login-required'})
                .success(() => {
                    console.log("KeycloakService.init: login success");
                    KeycloakService.auth.loggedIn = true;
                    KeycloakService.auth.authz = keycloakAuth;
//            KeycloakService.auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/demo/protocol/openid-connect/logout?redirect_uri=/angular2-product/index.html";
                    resolve();
                })
                .error(() => {
                    console.log("KeycloakService.init: login error");
                    reject();
                });
        });
    }

    /*
     logout() {
     console.log('*** LOGOUT');
     KeycloakService.auth.loggedIn = false;
     KeycloakService.auth.authz = null;

     window.location.href = KeycloakService.auth.logoutUrl;
     }
     */

    getToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (KeycloakService.auth.authz.token) {
                KeycloakService.auth.authz.updateToken(5)
                    .success(() => {
                        console.log("KeycloakService.getToken: token refreshed");
                        resolve(<string>KeycloakService.auth.authz.token);
                    })
                    .error(() => {
                        console.log("KeycloakService.getToken: Failed to refresh token");
                        reject('Failed to refresh token');
                    });
            }
        });
    }

    getUser(): string {
        return KeycloakService.auth.authz.tokenParsed.name;
    }

    getRealm(): string {
        return KeycloakService.auth.authz.realm;
    }

    canActivate() {
        console.log("AuthGuard.authenticated=" + KeycloakService.auth.loggedIn);
        return KeycloakService.auth.loggedIn;
    }

    getExpires():number {
        return KeycloakService.auth.authz.tokenParsed.exp;
    }

    /**
     * refresh the token from auth server
     */
    refresh():void {
        KeycloakService.auth.authz.updateToken(-1);
    }

    /**
     *
     * @param appName
     * @returns {boolean} true if appName is in saved role names
     */
    isAppGranted(appName: string ): boolean {
        let roles:string[] = KeycloakService.auth.authz.tokenParsed.realm_access.roles;
        for (let r in roles) {
            if ( roles[r]==appName ) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param appName
     * @param appRoleName
     * @returns {boolean}
     */
    isAppRoleGranted(appName: string, appRoleName: string): boolean {
        let appObj = KeycloakService.auth.authz.tokenParsed.resource_access[appName];
        if (! appObj.roles ) {
            return false;
        }
        else {
            for (let r in appObj.roles) {
                if ( r==appRoleName ) {
                    return true;
                }
            }
            return false;
        }
    }

    /**
     *
     * @param appName
     * @returns {any}
     */
    getAppRoles(appName: string): string[] {
        let appObj = KeycloakService.auth.authz.tokenParsed.resource_access[appName];
        if (! appObj.roles ) {
            return [];
        }
        else {
            return appObj.roles;
        }
    }
}
