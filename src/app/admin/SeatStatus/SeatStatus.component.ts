import { Component, OnInit } from '@angular/core';
import { BusSelectedService } from '../BusStatus/BusSelected.service';
import { SeatFetchService } from './SeatFetch.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seatStatus',
  templateUrl: './SeatStatus.component.html',
  styleUrls: ['./SeatStatus.component.css'],
})
export class SeatStatusComponent implements OnInit {
  BusDetails;
  SeatDetails;
  constructor(
    private http: HttpClient,
    private BusSelected: BusSelectedService,
    private SeatView: SeatFetchService
  ) {}
  ngOnInit(): void {
    this.BusDetails = this.BusSelected.SelectedBus;
    this.SeatView.OnFetch(this.BusDetails).subscribe((res) => {
      this.SeatDetails = res;
    });
  }
  OnCancel(data) {
    this.SeatView.cancellation(data);
    console.log(data);
    alert('The Seat ' + data.SeatNo + "'s booking has been cancelled.");
  }
}
