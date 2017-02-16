import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import {KeycloakService} from "./app/auth/keycloak.service";
import {bootstrapWithoutAuth, bootstrapWithKeycloak} from "./app/dynamic.bootstrap";

if (environment.production) {
  enableProdMode();
}


/**
 * depending of the environment configuration, KeycloakService choose the keycloak.json to load
 */

let hackThis = false;
if (hackThis) {
    platformBrowserDynamic().bootstrapModule(AppModule);
}

if (environment.noAuth) {
    // starts withou any authentication
    bootstrapWithoutAuth();
}
else {
    bootstrapWithKeycloak();
}
