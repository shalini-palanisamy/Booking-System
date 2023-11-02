import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeatsService {
  selectedBus; 
  seatStucture; 
  selectedSeats; 
  
  constructor(private http: HttpClient) {}

  fetchSeatInfo() {
    return this.http
      .get(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          this.selectedBus.BusNo +
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
      ); //http request to firebase DB to fetch the seat info of specific bus
  } //fetch and formate the seat information from DB

  updateGender(item, value) {
    item.CustGender = value; //update the gender locally
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          item.Busno +
          '/' +
          item.id +
          '.json',
        item
      )
      .subscribe((res) => {}); //update the seat info in DB with locally updated object
  }
} //update the gender property of the seat object while cancelling or booking
