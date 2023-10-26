import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SearchModule } from './search/search.module';
import { BookingSeatComponent } from './BookingSeats/booking-seat.component';
import { BusSeatsComponent } from './BusSeats/bus-seats.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [BusSeatsComponent, BookingSeatComponent],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    SearchModule,
    UserRoutingModule,
    CommonModule,
  ],
})
export class UserModule {}
