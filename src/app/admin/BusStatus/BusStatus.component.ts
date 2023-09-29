import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SeatFetchService } from './SeatFetch.service';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-busStatus',
  templateUrl: './BusStatus.component.html',
  styleUrls: ['./BusStatus.component.css'],
})
export class BusStatusComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private SeatView: SeatFetchService,
    private authSerive: AuthService
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
      });
    this.CancelForm = new FormGroup({
      SeatName: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  searchStatus = false;
  busData;
  searchBus;
  showtable = false;
  SeatDetails;
  showForm = false;
  CancelForm: FormGroup;

  OnView(bus) {
    this.searchStatus = false;
    this.showtable = !this.showtable;
    this.SeatView.SelectedBus = bus;
    this.SeatView.OnFetch(bus).subscribe((res) => {
      this.SeatDetails = res;
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
        this.SeatView.cancellation(index);
        this.SeatView.OnFetch(this.SeatView.SelectedBus.BusNo).subscribe(
          (res) => {
            this.SeatDetails = res;
            console.log(this.SeatDetails);
          }
        );
      }
    }
    this.CancelForm.reset();
    alert('Ticket had been cancelled..');
  }

  OnLogout() {
    this.authSerive.logout();
  }
  Addbus() {}
}
