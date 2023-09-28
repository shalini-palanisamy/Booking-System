import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { SignInComponent } from './auth/signIn/signIn.component';
import { LogInComponent } from './auth/logIn/logIn.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { LoadingSpinnerComponent } from './loadingSpinner/loadingSpinner.component';
import { ViewBusComponent } from './viewBus/viewBus.component';
import { SearchComponent } from './viewBus/search/search.component';
import { BusSeatsComponent } from './viewBus/BusSeats/BusSeats.component';
import { BookingSeatComponent } from './viewBus/BookingSeats/BookingSeat.component';
import { BookingSummaryComponent } from './viewBus/BookingSummary/BookingSummary.component';
import { AdminComponent } from './admin/admin.component';
import { BusStatusComponent } from './admin/BusStatus/BusStatus.component';
import { SeatStatusComponent } from './admin/SeatStatus/SeatStatus.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthGuard } from './auth/auth.guard';
import { ConfirmBookingComponent } from './viewBus/ConfirmBooking/ConfirmBooking.component';

const appRoutes: Routes = [
  { path: '', component: HeaderComponent },
  {
    path: 'auth',
    component: AuthComponent,
    children: [{ path: 'logIn', component: LogInComponent }],
  },
  { path: 'signIn', component: SignInComponent },
  { path: 'viewBus', component: ViewBusComponent, canActivate: [AuthGuard] },
  { path: 'busSeats', component: BusSeatsComponent, canActivate: [AuthGuard] },
  {
    path: 'bookingSeat',
    component: BookingSeatComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bookingStatus',
    component: BookingSummaryComponent,
    canActivate: [AuthGuard],
  },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  {
    path: 'busStatus',
    component: BusStatusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'seatStatus',
    component: SeatStatusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'confirmBooking',
    component: ConfirmBookingComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    SignInComponent,
    AuthComponent,
    HeaderComponent,
    LoadingSpinnerComponent,
    ViewBusComponent,
    SearchComponent,
    BusSeatsComponent,
    BookingSeatComponent,
    BookingSummaryComponent,
    AdminComponent,
    BusStatusComponent,
    SeatStatusComponent,
    ConfirmBookingComponent,
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
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
