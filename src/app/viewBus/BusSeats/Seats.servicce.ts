import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeatsService {
  selectedBus;
  SeatStucture;
  SelectedSeats;
  constructor(private http: HttpClient) {}

  OnFetchBus() {
    console.log(this.selectedBus);
    console.log('at serfetch');
    const number = this.selectedBus.BusNo;
    return this.http
      .get(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          number +
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
}
