import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SeatFetchService } from '../BusStatus/SeatFetch.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { addSeatService } from './addSeat.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-addBus',
  templateUrl: './addBus.component.html',
  styleUrls: ['./addBus.component.css'],
})
export class AddBusComponent implements OnInit {
  AddBusForm: FormGroup;
  callEdit = false;
  dataUrl;
  constructor(
    private SeatView: SeatFetchService,
    private http: HttpClient,
    private addseatSearvice: addSeatService
  ) {}
  BusToAdd = {
    BookedSeats: { seater: 0, sleeper: 0 },
    AvailbleSeat: { seater: 18, sleeper: 15 },
    BusName: '',
    BusValue: '',
    BusNo: 0,
    FromLocation: '',
    ToLocation: '',
    Rating: '4.8',
    time: { startTime: '22:00 P.M', endTime: '7:00 A.M', totalHours: '8hrs' },
    seats: {
      seater: {
        TotalSeats: 18,
        price: 0,
      },
      sleeper: {
        lower: {
          TotalSeats: 5,
          price: 0,
        },
        upper: {
          TotalSeats: 15,
          price: 0,
        },
      },
    },
    Price: 0,
    id: '',
  };
  ngOnInit() {
    this.AddBusForm = new FormGroup({
      BusName: new FormControl(null, [Validators.required]),
      BusNo: new FormControl(null, [Validators.required]),
      FromLoc: new FormControl(null, [Validators.required]),
      ToLoc: new FormControl(null, [Validators.required]),
      SeaterPrice: new FormControl(null, [Validators.required]),
      SleeperPrice: new FormControl(null, [Validators.required]),
    });
  }
  Onsubmit() {
    console.log(this.AddBusForm);
    this.BusToAdd.BusName = this.AddBusForm.value.BusName;
    this.BusToAdd.BusValue = this.AddBusForm.value.BusNo;
    this.BusToAdd.FromLocation = this.AddBusForm.value.FromLoc;
    this.BusToAdd.ToLocation = this.AddBusForm.value.ToLoc;
    this.BusToAdd.Price = this.AddBusForm.value.SeaterPrice;
    this.BusToAdd.seats.seater.price = this.AddBusForm.value.SeaterPrice;
    this.BusToAdd.seats.sleeper.upper.price =
      this.AddBusForm.value.SleeperPrice;
    this.BusToAdd.seats.sleeper.lower.price =
      this.AddBusForm.value.SleeperPrice + 200;
    this.BusToAdd.BusNo = this.SeatView.TotalBus + 1;
    this.http
      .post(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses.json',
        this.BusToAdd
      )
      .pipe(
        map((data: any) => {
          return data.name;
        })
      )
      .subscribe((res) => {
        this.BusToAdd.id = res;
        this.addseatSearvice.addSeats(res);
        alert('The Bus has been added');
        this.editUrl();
      });
  }

  editUrl() {
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
          this.BusToAdd.id +
          '.json',
        this.BusToAdd
      )
      .subscribe((res) => {
        console.log(res);
      });
  }
}
