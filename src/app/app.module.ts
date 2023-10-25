import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignInComponent } from './auth/signUp/signUp.component';
import { AuthComponent } from './auth/auth.component';
import { ViewBusComponent } from './viewBus/view-bus.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { ViewBusModule } from './viewBus/view-bus.module';
import { AdminModule } from './admin/admin.module';
import { SearchModule } from './viewBus/search/search.module';
import { LogInModule } from './auth/logIn/logIn.module';
import { CoreModule } from './core.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AdminComponent,
    ViewBusComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ViewBusModule,
    SearchModule,
    AdminModule,
    LogInModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
