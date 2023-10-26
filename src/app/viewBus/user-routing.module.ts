import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusSeatsComponent } from './BusSeats/bus-seats.component';
import { AuthGuard } from '../auth/auth.guard';
import { BookingSeatComponent } from './BookingSeats/booking-seat.component';

const appRoutes: Routes = [
  {
    path: 'busSeats',
    component: BusSeatsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bookingSeat',
    component: BookingSeatComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
