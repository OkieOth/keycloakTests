/**
 * Created by eiko on 07.02.17.
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    authenticated:boolean;

    constructor(private router: Router) {
        this.authenticated=false;
    }

    canActivate() {
        console.log("AuthGuard.authenticated="+this.authenticated);
        if (this.authenticated) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}