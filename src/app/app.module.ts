import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SignInComponent } from './auth/signUp/signUp.component';
import { LogInComponent } from './auth/logIn/logIn.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './auth/loadingSpinner/loading-spinner.component';
import { ViewBusComponent } from './viewBus/view-bus.component';
import { SearchComponent } from './viewBus/search/search.component';
import { AdminComponent } from './admin/admin.component';
import { BusStatusComponent } from './admin/BusStatus/bus-status.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AddBusComponent } from './admin/addBus/add-bus.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ViewBusModule } from './viewBus/view-bus.module';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    SignInComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    ViewBusComponent,
    SearchComponent,
    AdminComponent,
    BusStatusComponent,
    AddBusComponent,
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ViewBusModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
