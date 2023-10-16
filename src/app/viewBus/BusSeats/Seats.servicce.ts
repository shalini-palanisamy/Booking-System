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
    console.log(this.selectedBus.BusNo + 'UpdateGender');
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
  updateGender(item, value) {
    item.CustGender = value;
    console.log(item.BusNo + 'UpdateGender');
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          item.Busno +
          '/' +
          item.id +
          '.json',
        item
      )
      .subscribe((res) => {
        console.log(res);
      });
  }
}
