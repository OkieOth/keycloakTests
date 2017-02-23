import {Component, OnInit, Output, OnDestroy} from '@angular/core';
import {KeycloakService} from "../auth/keycloak.service";
import {Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {environment} from "../../environments/environment";

interface IRealmPermissions {
    link:string;
    txt:string;
}

interface IResourcePermissions {
    values:string[];
    txt:string;
}

@Component({
    selector: 'main-view',
    templateUrl: './main-view.component.html',
    styleUrls: ['./main-view.component.css'],
})
export class MainViewComponent implements OnInit,OnDestroy {
    private timer;
    debug:string;
    ticks:number = 0;
    private subscription:Subscription;

    constructor(private keycloakService:KeycloakService) {
    }

    ngOnInit() {
        this.timer = Observable.timer(10000,10000);
        this.subscription = this.timer.subscribe((t) => {
            console.log('tick: '+t);
            this.ticks = t;
            this.debug = t+" - " + this.keycloakService.getUser();
            this.keycloakService.refresh();
        });
    }

    ngOnDestroy(){
        console.log("Destroy timer");
        this.subscription.unsubscribe();
    }

    get context():string {
        return "test-context";
    }

    get realm():string {
        return this.keycloakService.getRealm();
    }

    get user():string {
        return this.keycloakService.getUser();
    }

    get tokenExpires():number {
        let exp = this.keycloakService.getExpires();
        return exp;
    }

    get realmPermissions(): IRealmPermissions[] {
        let ret: IRealmPermissions[] = [];
        if (this.keycloakService.isAppGranted("app-eins")) {
            let linkStr = environment.behindApache ? '/eins/' : 'http://localhost:8002/eins/';
            ret.push({link:linkStr,txt:'Eins'});
        }
        if (this.keycloakService.isAppGranted("app-zwei")) {
            let linkStr = environment.behindApache ? '/zwei/' : 'http://localhost:8003/zwei/';
            ret.push({link:linkStr, txt: 'Zwei'});
        }
        return ret;
    }

    get resourcePermissions(): IResourcePermissions[] {
        let ret: IResourcePermissions[] = [];
        ret.push({txt:'Eins', values: this.keycloakService.getAppRoles("eins")});
        ret.push({txt:'Zwei', values: this.keycloakService.getAppRoles("zwei")});
        return ret;
    }
}
