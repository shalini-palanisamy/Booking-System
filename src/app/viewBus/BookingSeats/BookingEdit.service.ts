import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SeatsService } from '../BusSeats/Seats.servicce';

@Injectable({ providedIn: 'root' })
export class BookingEditSerive {
  FormData;
  TotalAmount;
  currentId;
  value;
  Busno;
  UpdatedData = [];
  seaterCount = 0;
  sleeperCount = 0;
  EditBus;
  constructor(private SeatService: SeatsService, private http: HttpClient) {}
  OnEditData() {
    for (let index of this.FormData) {
      this.SeatService.SelectedSeats.find((seat) => {
        if (seat.SeatNo === index.SeatNo) {
          this.currentId = seat.id;
          if (seat.SeatType === 'seater') ++this.seaterCount;
          else if (seat.SeatType === 'sleeper') ++this.sleeperCount;
          this.value = {
            BookingStatus: true,
            BusNo: seat.Busno,
            SeatNo: seat.SeatNo,
            SeatPosition: seat.SeatPosition,
            SeatType: seat.SeatType,
            id: seat.id,
            price: seat.price,
            CustAge: index.age,
            CustGender: index.gender,
            CustName: index.name,
          };
          this.Busno = this.SeatService.selectedBus.BusNo;
          this.http
            .put(
              'https://ebusticketbooking-default-rtdb.firebaseio.com/BusNo' +
                this.Busno +
                '/' +
                this.currentId +
                '.json',
              this.value
            )
            .subscribe((res) => {
              this.UpdatedData.push(res);
            });
        }
      });
    }
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
