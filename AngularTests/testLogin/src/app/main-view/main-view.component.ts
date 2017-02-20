import {Component, OnInit, Output, OnDestroy} from '@angular/core';
import {KeycloakService} from "../auth/keycloak.service";
import {Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";

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
    ticks:number = 0;
    private subscription:Subscription;

    constructor(private keycloakService:KeycloakService) {
    }

    ngOnInit() {
        this.timer = Observable.timer(10000,10000);
        this.subscription = this.timer.subscribe((t) => {
            console.log('tick: '+t);
            this.ticks = t;
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
            ret.push({link:'http://localhost:8000/eins/',txt:'Eins'});
        }
        if (this.keycloakService.isAppGranted("app-zwei")) {
            ret.push({link:'http://localhost:8000/zwei/', txt: 'Zwei'});
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
