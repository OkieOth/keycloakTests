import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { MainViewComponent } from './main-view/main-view.component';
import {PanelModule} from 'primeng/primeng';
import {AuthGuard} from "./auth/AuthGuard";

const preAuthRoutes: Routes = [
    { path: '',
        redirectTo: 'main',
        pathMatch: 'full'
    },
    { path: 'login', component: LoginViewComponent },
    { path: 'main', component: MainViewComponent, canActivate: [AuthGuard] },
    { path: '**', component: MainViewComponent, canActivate: [AuthGuard] }
];



@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    MainViewComponent
  ],
  imports: [
    RouterModule.forRoot(preAuthRoutes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    PanelModule
  ],
  providers: [AuthGuard],

  // this is needed for all Components used in dynamic routes
  entryComponents: [MainViewComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
