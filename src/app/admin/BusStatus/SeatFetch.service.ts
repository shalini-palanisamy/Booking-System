import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { SeatsService } from 'src/app/viewBus/BusSeats/Seats.servicce';
@Injectable({ providedIn: 'root' })
export class SeatFetchService {
  SelectedBus;
  TotalBus;
  constructor(private http: HttpClient, private seatService: SeatsService) {}
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
  cancellationAdjust(Stucture, index, value) {
    console.log(Stucture);
    console.log(index);
    if (value.BookingStatus === true) {
      if (value.SeatNo.includes('W')) {
        if (
          (Stucture[index + 1].BookingStatus === false &&
            Stucture[index + 1].CustGender === 'female') ||
          Stucture[index + 1].CustGender === 'male'
        ) {
          this.seatService.updateGender(Stucture[index + 1], '');
        }
      } else if (
        value.SeatNo.includes('25') ||
        value.SeatNo.includes('28') ||
        value.SeatNo.includes('31') ||
        value.SeatNo.includes('34') ||
        value.SeatNo.includes('37')
      ) {
        if (
          (Stucture[index - 1]?.BookingStatus === false &&
            Stucture[index - 1]?.CustGender === 'female') ||
          Stucture[index - 1]?.CustGender === 'male'
        ) {
          this.seatService.updateGender(Stucture[index - 1], '');
        }
      } else {
        if (
          (Stucture[index - 1]?.BookingStatus === false &&
            Stucture[index - 1]?.CustGender === 'female') ||
          Stucture[index - 1]?.CustGender === 'male'
        ) {
          this.seatService.updateGender(Stucture[index - 1], '');
        }
      }
    }
  }
}
