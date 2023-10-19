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
  addBusForm: FormGroup;
  dataUrl;
  constructor(
    private SeatView: SeatFetchService,
    private http: HttpClient,
    private addseatSearvice: addSeatService
  ) {}
  busToAdd = {
    BookedSeats: { seater: 0, sleeper: 0 },
    AvailbleSeat: { seater: 18, sleeper: 20 },
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
    // Initialize the AddBusForm with form controls and validation rules
    this.addBusForm = new FormGroup({
      BusName: new FormControl(null, [Validators.required]),
      BusNo: new FormControl(null, [Validators.required]),
      FromLoc: new FormControl(null, [Validators.required]),
      ToLoc: new FormControl(null, [Validators.required]),
      SeaterPrice: new FormControl(null, [Validators.required]),
      SleeperPrice: new FormControl(null, [Validators.required]),
    });
  }

  // Method to handle bus addition form submission
  submitBusData() {
    if (this.addBusForm.valid) {
      // Populate the BusToAdd structure with form values
      this.busToAdd.BusName = this.addBusForm.value.BusName;
      this.busToAdd.BusValue = this.addBusForm.value.BusNo;
      this.busToAdd.FromLocation = this.addBusForm.value.FromLoc;
      this.busToAdd.ToLocation = this.addBusForm.value.ToLoc;
      this.busToAdd.Price = this.addBusForm.value.SeaterPrice;
      this.busToAdd.seats.seater.price = this.addBusForm.value.SeaterPrice;
      this.busToAdd.seats.sleeper.upper.price =
        this.addBusForm.value.SleeperPrice;
      this.busToAdd.seats.sleeper.lower.price =
        this.addBusForm.value.SleeperPrice + 200;
      this.busToAdd.BusNo = this.SeatView.totalBus + 1;
      // Post the new bus data to the Firebase database
      this.http
        .post(
          'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses.json',
          this.busToAdd
        )
        .pipe(
          map((data: any) => {
            return data.name;
          })
        )
        .subscribe((res) => {
          this.busToAdd.id = res;
          // Add seats for the newly created bus
          this.addseatSearvice.addSeats(res);
          // Display a success alert
          alert('The Bus has been added');
          // Update the URL of the bus
          this.editUrl();
        });
    }
  }
  // Method to edit the URL of the bus
  editUrl() {
    this.http
      .put(
        'https://ebusticketbooking-default-rtdb.firebaseio.com/Buses/' +
          this.busToAdd.id +
          '.json',
        this.busToAdd
      )
      .subscribe((res) => {});
  }
}
