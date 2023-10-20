import { NgModule } from '@angular/core';

import { BookingSeatComponent } from './BookingSeats/booking-seat.component';
import { BusSeatsComponent } from './BusSeats/bus-seats.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [BusSeatsComponent, BookingSeatComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
})
export class ViewBusModule {}
