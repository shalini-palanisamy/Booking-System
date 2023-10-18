import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SeatFetchService } from './SeatFetch.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-busStatus',
  templateUrl: './BusStatus.component.html',
  styleUrls: ['./BusStatus.component.css'],
})
export class BusStatusComponent implements OnInit {
  searchStatus = false;
  busData;
  searchBus;
  showtable = false;
  SeatDetails;
  showForm = false;
  CancelForm: FormGroup;
  cancelticket = false;

  constructor(
    private http: HttpClient,
    private SeatView: SeatFetchService,
    private authSerive: AuthService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.http
      .get('https://ebusticketbooking-default-rtdb.firebaseio.com/Buses.json')
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
      )
      .subscribe((res) => {
        this.busData = res;
        this.SeatView.TotalBus = this.busData.length;
        console.log(this.SeatView.TotalBus);
      });
    this.CancelForm = new FormGroup({
      SeatName: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  OnView(bus) {
    this.searchStatus = false;
    this.showtable = !this.showtable;
    this.SeatView.SelectedBus = bus;
    this.SeatView.OnFetch(bus).subscribe((res) => {
      this.SeatDetails = res;
      const seatNumbers = this.SeatDetails.map((item) => {
        const seatNumber = parseInt(item.SeatNo.replace(/\D/g, ''), 10);
        return seatNumber;
      });

      // Sort the this.structure array based on the parsed seat numbers
      this.SeatDetails.sort((a, b) => {
        const seatNumberA = seatNumbers[this.SeatDetails.indexOf(a)];
        const seatNumberB = seatNumbers[this.SeatDetails.indexOf(b)];
        return seatNumberA - seatNumberB;
      });
      console.log(this.SeatDetails);
    });
  }

  returnBus(searchValue) {
    this.searchBus = [];
    this.searchStatus = true;
    searchValue.fromLoc = searchValue.fromLoc.toLowerCase();
    searchValue.toLoc = searchValue.toLoc.toLowerCase();
    for (let index of this.busData) {
      let val = index.FromLocation.toLowerCase();
      let val2 = index.ToLocation.toLowerCase();
      if (
        val.includes(searchValue.fromLoc) &&
        val2.includes(searchValue.toLoc)
      ) {
        this.searchBus.push(index);
      }
    }
  }

  Onsubmit() {
    for (let index of this.SeatDetails) {
      if (
        index.SeatNo ===
        '"' + this.CancelForm.value.SeatName.toUpperCase() + '"'
      ) {
        let extractedNumber = 0;
        this.cancelticket = true;
        const match = index.SeatNo.match(/\d+/); // This regex matches one or more digits
        if (match) {
          extractedNumber = parseInt(match[0], 10); // Convert the matched string to an integer
        }
        this.SeatView.cancellationAdjust(
          this.SeatDetails,
          extractedNumber - 1,
          index
        );
        this.SeatView.cancellation(index);
        this.SeatView.OnFetch(this.SeatView.SelectedBus.BusNo).subscribe(
          (res) => {
            this.SeatDetails = res;
            console.log(this.SeatDetails);
          }
        );
        break;
      }
    }
    this.CancelForm.reset();
    if (this.cancelticket) alert('Ticket had been cancelled..');
    else
      alert('Seat Number entryed was not valid or this seat is not booked...');
  }

  OnLogout() {
    this.authSerive.logOut();
  }
  Addbus() {
    this.route.navigate(['addBus']);
  }
}
