import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MainViewComponent } from './main-view/main-view.component';
import {PanelModule} from 'primeng/primeng';
import {KeycloakService} from "./auth/keycloak.service";

const preAuthRoutes: Routes = [
    { path: '',
        redirectTo: 'main',
        pathMatch: 'full'
    },
    { path: 'main', component: MainViewComponent},
    { path: '**', component: MainViewComponent }
];



@NgModule({
  declarations: [
    AppComponent,
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
  providers: [KeycloakService],

  // this is needed for all Components used in dynamic routes
  entryComponents: [MainViewComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
