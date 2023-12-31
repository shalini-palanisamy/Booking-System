import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class addSeatService {
  countSeat = 0;
  Seats = {
    SeatNo: '',
    SeatPosition: '',
    Busno: 0,
    SeatType: '',
    price: 0,
    BookingStatus: false,
    CustName: '',
    CustAge: 0,
    CustGender: '',
    id: '',
  };
  storeValue;
  selectedBus;

  constructor(private http: HttpClient) {}
  // Method to add seats for a specific bus
  addSeats(busId) {
    this.http
      .get(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
          busId +
          '.json'
      )
      .pipe(
        map((data) => {
          return data;
        })
      )
      .subscribe((res) => {
        this.selectedBus = res;
        this.updateSeat();
      });
  }
  // Method to update seats for the selected bus
  updateSeat() {
    // Calculate the total number of seats for the bus
    this.countSeat =
      this.selectedBus.seats.seater.TotalSeats +
      this.selectedBus.seats.sleeper.upper.TotalSeats +
      this.selectedBus.seats.sleeper.lower.TotalSeats;
    const self = this;
    for (
      let seatindex = 1;
      seatindex <= this.selectedBus.seats.seater.TotalSeats;
      seatindex++
    ) {
      this.Seats.Busno = this.selectedBus.BusNo;
      if (seatindex % 2 !== 0) this.Seats.SeatNo = '"' + seatindex + 'SW' + '"';
      else this.Seats.SeatNo = '"' + seatindex + 'S' + '"';
      this.Seats.BookingStatus = false;
      this.Seats.price = this.selectedBus.seats.seater.price;
      this.Seats.SeatType = 'seater';
      this.Seats.SeatPosition = 'lower';

      const currentSeat = Object.assign({}, this.Seats); // Create a copy of Seats

      (function (self, seat) {
        self.http
          .post(
            'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
              seat.Busno +
              '.json',
            seat
          )
          .pipe(
            map((data: any) => {
              return data.name;
            })
          )
          .subscribe((res) => {
            seat.id = res;
            self.editUrl(seat);
          });
      })(this, currentSeat);
    }

    for (
      let seatindex = this.selectedBus.seats.seater.TotalSeats + 1;
      seatindex <=
      this.selectedBus.seats.seater.TotalSeats +
        this.selectedBus.seats.sleeper.lower.TotalSeats;
      seatindex++
    ) {
      this.Seats.Busno = this.selectedBus.BusNo;
      this.Seats.SeatNo = '"' + seatindex + 'SL' + '"';
      this.Seats.BookingStatus = false;
      this.Seats.price = this.selectedBus.seats.sleeper.lower.price;
      this.Seats.SeatType = 'sleeper';
      this.Seats.SeatPosition = 'lower';
      const currentSeat = Object.assign({}, this.Seats); // Create a copy of Seats

      (function (self, seat) {
        self.http
          .post(
            'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
              seat.Busno +
              '.json',
            seat
          )
          .pipe(
            map((data: any) => {
              return data.name;
            })
          )
          .subscribe((res) => {
            seat.id = res;
            self.editUrl(seat);
          });
      })(this, currentSeat);
    }
    for (
      let seatindex =
        this.selectedBus.seats.seater.TotalSeats +
        this.selectedBus.seats.sleeper.lower.TotalSeats +
        1;
      seatindex <= this.countSeat;
      seatindex++
    ) {
      this.Seats.Busno = this.selectedBus.BusNo;
      if (
        seatindex === 24 ||
        seatindex === 27 ||
        seatindex === 30 ||
        seatindex === 33 ||
        seatindex === 36
      )
        this.Seats.SeatNo = '"' + seatindex + 'SLW' + '"';
      else this.Seats.SeatNo = '"' + seatindex + 'SL' + '"';
      this.Seats.BookingStatus = false;
      this.Seats.price = this.selectedBus.seats.sleeper.upper.price;
      this.Seats.SeatType = 'sleeper';
      this.Seats.SeatPosition = 'upper';
      const currentSeat = Object.assign({}, this.Seats); // Create a copy of Seats

      (function (self, seat) {
        self.http
          .post(
            'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
              seat.Busno +
              '.json',
            seat
          )
          .pipe(
            map((data: any) => {
              return data.name;
            })
          )
          .subscribe((res) => {
            seat.id = res;
            self.editUrl(seat);
          });
      })(this, currentSeat);
    }
  }
  // Method to edit seat URL
  editUrl(value) {
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
          value.Busno +
          '/' +
          value.id +
          '.json',
        value
      )
      .subscribe((res) => {});
  }
}
