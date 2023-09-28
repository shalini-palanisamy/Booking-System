import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BusSelectedService } from '../BusStatus/BusSelected.service';
@Injectable({ providedIn: 'root' })
export class SeatFetchService {
  constructor(
    private http: HttpClient,
    private BusSelected: BusSelectedService
  ) {}
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
    if (data.SeatType === 'seater') {
      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.BusSelected.SelectedBus.id +
            '/BookedSeats/seater.json',
          Math.abs(this.BusSelected.SelectedBus.BookedSeats.seater - 1)
        )
        .subscribe((res) => {});
      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.BusSelected.SelectedBus.id +
            '/AvailbleSeat/seater.json',
          this.BusSelected.SelectedBus.AvailbleSeat.seater + 1
        )
        .subscribe((res) => {});
    } else {
      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.BusSelected.SelectedBus.id +
            '/BookedSeats/sleeper.json',
          Math.abs(this.BusSelected.SelectedBus.BookedSeats.sleeper - 1)
        )
        .subscribe((res) => {});

      this.http
        .put(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
            this.BusSelected.SelectedBus.id +
            '/AvailbleSeat/sleeper.json',
          this.BusSelected.SelectedBus.AvailbleSeat.sleeper + 1
        )
        .subscribe((res) => {});
    }

    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.BusSelected.SelectedBus.BusNo +
          '/' +
          data.id +
          '/BookingStatus.json',
        false
      )
      .subscribe((res) => {});
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.BusSelected.SelectedBus.BusNo +
          '/' +
          data.id +
          '/CustAge.json',
        0
      )
      .subscribe((res) => {});
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.BusSelected.SelectedBus.BusNo +
          '/' +
          data.id +
          '/CustName.json',
        '""'
      )
      .subscribe((res) => {});
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.BusSelected.SelectedBus.BusNo +
          '/' +
          data.id +
          '/CustGender.json',
        '""'
      )
      .subscribe((res) => {});
  }
}
