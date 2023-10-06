import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SeatsService } from '../BusSeats/Seats.servicce';
import { BookingEditSerive } from './BookingEdit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookingSeat',
  templateUrl: './BookingSeat.component.html',
  styleUrls: ['./BookingSeat.component.css'],
})
export class BookingSeatComponent implements OnInit {
  SubmitBooking: FormGroup;
  selectedSeats;
  selectedBus;
  seatForms: FormGroup[] = [];
  totalPrice = 0;
  ShowError = false;
  showConfirm = false;
  seatDataArray;
  paymentConfirm = false;
  BookingSummary;
  upiIdForm: FormGroup;
  constructor(
    private seatSerives: SeatsService,
    private fb: FormBuilder,
    private BookingService: BookingEditSerive,
    private route: Router
  ) {}
  ngOnInit() {
    this.selectedSeats = this.seatSerives.SelectedSeats;
    this.selectedBus = this.seatSerives.selectedBus;
    this.totalPrice = this.selectedSeats.reduce(
      (total, seat) => total + seat.price,
      0
    );
    this.SubmitBooking = this.fb.group({});

    // Create a form group for each selected seat
    this.selectedSeats.forEach((seat, index) => {
      const seatForm = this.fb.group({
        SeatNo: [seat.SeatNo],
        name: [
          '',
          [
            Validators.required, // Required validation
            Validators.minLength(3), // Minimum length of 3 characters
            this.customNameValidator(), // Custom name validation function
          ],
        ],
        age: [
          '',
          [
            Validators.required, // Required validation
            Validators.min(5), // Minimum age of 5
          ],
        ],
        gender: ['', Validators.required],
      });

      // Add the seatForm to the SubmitBooking form group with the unique name
      this.SubmitBooking.addControl('seat-' + (index + 1), seatForm);
      this.seatForms.push(seatForm);
    });
    this.upiIdForm = this.fb.group({
      upiId: ['', [Validators.required, this.upiIdValidator()]],
    });
  }
  errorMessages = {
    required: 'This field is required.',
    minlength: 'Minimum length should be 3 characters.',
    min: 'Minimum age is 5.',
    invalidName: 'Invalid name format (only letters and spaces).',
    invalidUpiId: 'Invalid UPI ID format.',
  };
  upiIdValidator() {
    return (control) => {
      const upiId = control.value;
      if (!upiId) {
        return null;
      }
      const regex = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/;
      if (regex.test(upiId)) {
        return null;
      } else {
        return { invalidUpiId: true };
      }
    };
  }
  customNameValidator() {
    return (control: FormControl): { [key: string]: any } | null => {
      const namePattern = /^[a-zA-Z\s]*$/;
      const value = control.value;
      if (!namePattern.test(value)) {
        return { invalidName: true };
      }
      return null;
    };
  }
  OnShow() {
    if (this.SubmitBooking.valid) {
      this.seatDataArray = this.seatForms.map((seatForm) => seatForm.value);
      this.BookingService.FormData = this.seatDataArray;
      this.BookingService.TotalAmount = this.totalPrice;
      this.showConfirm = true;
    }
  }
  Onsubmit() {
    this.BookingService.OnEditData();
    alert('Your tickets has been booked...');
    this.paymentConfirm = true;
    this.BookingSummary = this.BookingService.UpdatedData;
    console.log(this.BookingSummary);
    // this.route.navigate(['../bookingStatus'], { relativeTo: this.router });
  }
  BusList() {
    this.route.navigate(['viewBus']);
  }
}
