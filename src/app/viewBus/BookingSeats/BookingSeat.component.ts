import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SeatsService } from '../BusSeats/Seats.servicce';
import { BookingEditSerive } from './BookingEdit.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

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
  fb = inject(FormBuilder);
  errorMessages = {
    required: 'This field is required.',
    minlength: 'Minimum length should be 3 characters.',
    min: 'Minimum age is 5.',
    invalidName: 'Invalid name format (only letters and spaces).',
    invalidUpiId: 'Invalid UPI ID format.',
    maxlength: 'Maximun length should be 15 characters.',
    maxAge: 'Maximum age is 120.',
    pattern: 'Invalid age format. Please enter a valid number.',
  };

  constructor(
    private seatSerives: SeatsService,
    // private fb: FormBuilder,
    private BookingService: BookingEditSerive,
    private route: Router,
    private authSerive: AuthService
  ) {}

  ngOnInit() {
    this.selectedSeats = this.seatSerives.SelectedSeats;
    console.log('Seats:');
    console.log(this.selectedSeats);
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
            Validators.maxLength(15),
            Validators.required, // Required validation
            Validators.minLength(3), // Minimum length of 3 characters
            this.customNameValidator(), // Custom name validation function
          ],
        ],
        age: [
          '',
          [
            Validators.max(120),
            Validators.required, // Required validation
            Validators.min(5), // Minimum age of 5
            Validators.pattern('^[0-9]*$'),
          ],
        ],
        gender: [seat.CustGender],
      });

      // Add the seatForm to the SubmitBooking form group with the unique name
      this.SubmitBooking.addControl('seat-' + (index + 1), seatForm);
      this.seatForms.push(seatForm);
    });
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
    this.BookingSummary.splice(0, this.BookingSummary.length);
    // this.route.navigate(['../bookingStatus'], { relativeTo: this.router });
  }

  BusList() {
    this.route.navigate(['viewBus']);
  }

  OnLogout() {
    this.authSerive.logout();
  }
}
