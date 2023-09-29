import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class SeatFetchService {
  SelectedBus;
  constructor(private http: HttpClient) {}
  OnFetch(Bus) {
    return this.http
      .get(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          Bus.BusNo +
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
  cancellation(data) {
    console.log(data);
    console.log(this.SelectedBus);
    if (data.SeatType === 'seater') {
      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.SelectedBus.id +
            '/BookedSeats/seater.json',
          Math.abs(this.SelectedBus.BookedSeats.seater - 1)
        )
        .subscribe((res) => {});
      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.SelectedBus.id +
            '/AvailbleSeat/seater.json',
          this.SelectedBus.AvailbleSeat.seater + 1
        )
        .subscribe((res) => {});
    } else {
      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.SelectedBus.id +
            '/BookedSeats/sleeper.json',
          Math.abs(this.SelectedBus.BookedSeats.sleeper - 1)
        )
        .subscribe((res) => {});

      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.SelectedBus.id +
            '/AvailbleSeat/sleeper.json',
          this.SelectedBus.AvailbleSeat.sleeper + 1
        )
        .subscribe((res) => {});
    }

    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.SelectedBus.BusNo +
          '/' +
          data.id +
          '/BookingStatus.json',
        false
      )
      .subscribe((res) => {});
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.SelectedBus.BusNo +
          '/' +
          data.id +
          '/CustAge.json',
        0
      )
      .subscribe((res) => {});
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.SelectedBus.BusNo +
          '/' +
          data.id +
          '/CustName.json',
        '""'
      )
      .subscribe((res) => {});
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.SelectedBus.BusNo +
          '/' +
          data.id +
          '/CustGender.json',
        '""'
      )
      .subscribe((res) => {});
  }
}
