import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { BusStatusComponent } from './admin/BusStatus/bus-status.component';
import { AddBusComponent } from './admin/addBus/add-bus.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth/auth.guard';
import { LogInComponent } from './auth/logIn/logIn.component';
import { SignInComponent } from './auth/signUp/signUp.component';
import { BookingSeatComponent } from './viewBus/BookingSeats/booking-seat.component';
import { BusSeatsComponent } from './viewBus/BusSeats/bus-seats.component';
import { ViewBusComponent } from './viewBus/view-bus.component';

const appRoutes: Routes = [
  {
    path: '',
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
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  {
    path: 'busStatus',
    component: BusStatusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addBus',
    component: AddBusComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
