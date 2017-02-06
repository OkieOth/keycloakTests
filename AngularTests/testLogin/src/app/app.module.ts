import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { MainViewComponent } from './main-view/main-view.component';
import {PanelModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    MainViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    PanelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
