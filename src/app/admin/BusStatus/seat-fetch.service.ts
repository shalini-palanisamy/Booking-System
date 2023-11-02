import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { SeatsService } from 'src/app/viewBus/BusSeats/seats.service';
@Injectable({ providedIn: 'root' })
export class SeatFetchService {
  selectedBus;
  totalBus;

  constructor(private http: HttpClient, private seatService: SeatsService) {}

  // Fetch seat data for a specific bus.
  fetchBusDetails(bus) {
    return this.http
      .get(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          bus.BusNo +
          '.json'
      )
      .pipe(
        map((data) => {
          const dataEntryed = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              dataEntryed.push({ ...data[key], id: key });
            }
          }

          return dataEntryed;
        })
      );
  }

  // Handle seat cancellation.
  cancellation(data) {
    // Update booked and available seats for 'seater' type.
    if (data.SeatType === 'seater') {
      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.selectedBus.id +
            '/BookedSeats/seater.json',
          Math.abs(this.selectedBus.BookedSeats.seater - 1)
        )
        .subscribe((res) => {});
      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.selectedBus.id +
            '/AvailbleSeat/seater.json',
          this.selectedBus.AvailbleSeat.seater + 1
        )
        .subscribe((res) => {});
    } else {
      // Update booked and available seats for 'sleeper' type.
      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.selectedBus.id +
            '/BookedSeats/sleeper.json',
          Math.abs(this.selectedBus.BookedSeats.sleeper - 1)
        )
        .subscribe((res) => {});

      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.selectedBus.id +
            '/AvailbleSeat/sleeper.json',
          this.selectedBus.AvailbleSeat.sleeper + 1
        )
        .subscribe((res) => {});
    }
    // Update booking status and related customer information.
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.selectedBus.BusNo +
          '/' +
          data.id +
          '/BookingStatus.json',
        false
      )
      .subscribe((res) => {});
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.selectedBus.BusNo +
          '/' +
          data.id +
          '/CustAge.json',
        0
      )
      .subscribe((res) => {});
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.selectedBus.BusNo +
          '/' +
          data.id +
          '/CustName.json',
        '""'
      )
      .subscribe((res) => {});
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.selectedBus.BusNo +
          '/' +
          data.id +
          '/CustGender.json',
        '""'
      )
      .subscribe((res) => {});
  }
  // Update booking status and related customer information.
  cancellationAdjust(Stucture, index, value) {
    if (value.BookingStatus === true) {
      if (value.SeatNo.includes('W')) {
        if (Stucture[index + 1].BookingStatus === false) {
          if (
            Stucture[index + 1].CustGender === 'female' ||
            Stucture[index + 1].CustGender === 'male'
          ) {
            this.seatService.updateGender(Stucture[index + 1], '');
          }
        }
      } else if (
        value.SeatNo.includes('25') ||
        value.SeatNo.includes('28') ||
        value.SeatNo.includes('31') ||
        value.SeatNo.includes('34') ||
        value.SeatNo.includes('37')
      ) {
        if (Stucture[index - 1].BookingStatus === false) {
          if (
            Stucture[index - 1].CustGender === 'female' ||
            Stucture[index - 1].CustGender === 'male'
          ) {
            this.seatService.updateGender(Stucture[index - 1], '');
          }
        }
      } else {
        if (Stucture[index - 1].BookingStatus === false) {
          if (
            Stucture[index - 1].CustGender === 'female' ||
            Stucture[index - 1].CustGender === 'male'
          ) {
            this.seatService.updateGender(Stucture[index - 1], '');
          }
        }
      }
    }
  }
}
