/**
 * Created by eiko on 16.02.17.
 */
import {AppModule} from "./app.module";
import {KeycloakService} from "./auth/keycloak.service";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

export function bootstrapWithoutAuth () {
    // starts withou any authentication
    platformBrowserDynamic().bootstrapModule(AppModule);
}

export function bootstrapWithKeycloak () {
    KeycloakService.init()
        .then(() => {
            const platform = platformBrowserDynamic();
            platform.bootstrapModule(AppModule);
        })
        .catch(() => window.location.assign('./login_error.html'));
}
