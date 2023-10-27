import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SeatsService } from '../BusSeats/seats.service';

@Injectable({ providedIn: 'root' })
export class BookingEditSerive {
  seatFormData; // This variable is used to store the form data for seats booked by customers.
  totalAmount; // It holds the total amount for the booking.
  currentId; // This variable keeps track of the current seat's ID during processing.
  updateSeatValue; // Used to store data for updating the seat status and customer information.
  bookedSeats = []; // An array to collect information about successfully booked seats.
  seaterCount = 0; // Keeps count of seater seats booked.
  sleeperCount = 0; // Keeps count of sleeper seats booked.

  constructor(private SeatService: SeatsService, private http: HttpClient) {}

  // This method is responsible for updating the seat booking status and seat counts.
  onEditData() {
    for (let index of this.seatFormData) {
      // Find the corresponding seat based on SeatNo
      this.SeatService.selectedSeats.find((seat) => {
        if (seat.SeatNo === index.SeatNo) {
          this.currentId = seat.id;

          // Check the seat type (seater or sleeper) and increment the respective counter
          if (seat.SeatType === 'seater') ++this.seaterCount;
          else if (seat.SeatType === 'sleeper') ++this.sleeperCount;

          // Prepare data for updating the seat
          this.updateSeatValue = {
            BookingStatus: true,
            Busno: seat.Busno,
            SeatNo: seat.SeatNo,
            SeatPosition: seat.SeatPosition,
            SeatType: seat.SeatType,
            id: seat.id,
            price: seat.price,
            CustAge: index.age,
            CustGender: index.gender,
            CustName: index.name,
          };

          // Update the seat data in the database
          this.http
            .put(
              'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
                this.SeatService.selectedBus.BusNo +
                '/' +
                this.currentId +
                '.json',
              this.updateSeatValue
            )
            .subscribe((res) => {
              this.bookedSeats.push(res);
            });
        }
      });
    }

    // Update the count of seater and sleeper bookings for the selected bus
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
          this.SeatService.selectedBus.id +
          '/BookedSeats/seater.json',
        this.seaterCount + this.SeatService.selectedBus.BookedSeats.seater
      )
      .subscribe((res) => {});

    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
          this.SeatService.selectedBus.id +
          '/BookedSeats/sleeper.json',
        this.sleeperCount + this.SeatService.selectedBus.BookedSeats.sleeper
      )
      .subscribe((res) => {});

    // Update the count of available seater and sleeper seats for the selected bus
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
          this.SeatService.selectedBus.id +
          '/AvailbleSeat/seater.json',
        Math.abs(
          this.SeatService.selectedBus.AvailbleSeat.seater - this.seaterCount
        )
      )
      .subscribe((res) => {});

    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
          this.SeatService.selectedBus.id +
          '/AvailbleSeat/sleeper.json',
        Math.abs(
          this.SeatService.selectedBus.AvailbleSeat.sleeper - this.sleeperCount
        )
      )
      .subscribe((res) => {});
  }
}
