import { Component, OnInit } from '@angular/core';
import { BookingEditSerive } from '../BookingSeats/BookingEdit.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-Confirm',
  templateUrl: './ConfirmBooking.component.html',
  styleUrls: ['./ConfirmBooking.component.css'],
})
export class ConfirmBookingComponent implements OnInit {
  FormValue;
  Totalamount;
  constructor(
    private EditBooking: BookingEditSerive,
    private route: Router,
    private router: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.FormValue = this.EditBooking.FormData;
    this.Totalamount = this.EditBooking.TotalAmount;
  }
  Onsubmit() {
    this.EditBooking.OnEditData();
    alert('Your tickets has been booked...');
    this.route.navigate(['../bookingStatus'], { relativeTo: this.router });
  }
}
