import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import {KeycloakService} from "./app/auth/keycloak.service";

if (environment.production) {
  enableProdMode();
}

KeycloakService.init()
    .then(() => {
        const platform = platformBrowserDynamic();
        platform.bootstrapModule(AppModule);
    })
    .catch(() => window.location.assign('./login_error.html'));

/*
platformBrowserDynamic().bootstrapModule(AppModule);
*/