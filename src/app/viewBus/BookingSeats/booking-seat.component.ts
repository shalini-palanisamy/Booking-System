import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { SeatsService } from '../BusSeats/seats.service';
import { BookingEditSerive } from './booking-edit.service';

@Component({
  selector: 'app-booking-seat',
  templateUrl: './booking-seat.component.html',
  styleUrls: ['./booking-seat.component.css'],
})
export class BookingSeatComponent implements OnInit {
  submitBooking: FormGroup;
  selectedSeats;
  selectedBus;
  seatForms: FormGroup[] = [];
  totalPrice = 0;
  showConfirm = false;
  seatDataArray = [];
  paymentConfirm = false;
  bookingSummary;
  formBuilder = inject(FormBuilder);
  errorMessages = {
    required: 'This field is required*',
    minlength: 'Minimum length should be 3 characters*',
    min: 'Minimum age is 5*',
    invalidName: 'Invalid name format (only letters and spaces)*',
    maxlength: 'Maximum length should be 15 characters*',
    maxAge: 'Maximum age is 120*',
    pattern: 'Invalid age format. Please enter a valid number*',
  };

  constructor(
    private seatSerives: SeatsService,
    private bookingService: BookingEditSerive,
    private route: Router,
    private authSerive: AuthService
  ) {
    this.route.events
      .pipe(filter((res): res is NavigationEnd => res instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.id === 1 && event.url === event.urlAfterRedirects) {
          this.route.navigate(['viewBus']);
        }
      });
  }

  ngOnInit() {
    // Get selected seats and bus data
    this.selectedSeats = this.seatSerives.selectedSeats;
    this.selectedBus = this.seatSerives.selectedBus;

    // Calculate the total price for selected seats
    this.totalPrice = this.selectedSeats.reduce(
      (total, seat) => total + seat.price,
      0
    );

    // Initialize the form for submitting booking data
    this.submitBooking = this.formBuilder.group({});

    // Create a form group for each selected seat
    this.selectedSeats.forEach((seat, index) => {
      const seatForm = this.formBuilder.group({
        SeatNo: [seat.SeatNo],
        name: [
          '',
          [
            Validators.maxLength(15), //Maximum length of 15 character
            Validators.required, // Required validation
            Validators.minLength(3), // Minimum length of 3 characters
            this.customNameValidator(), // Custom name validation function
          ],
        ],
        age: [
          '',
          [
            Validators.max(120), //Maximum age of 120
            Validators.required, // Required validation
            Validators.min(5), // Minimum age of 5
            Validators.pattern('^[0-9]*$'), // checks that the input consists of digits (0-9) only
          ],
        ],
        gender: [seat.CustGender],
      });

      // Add the seatForm to the SubmitBooking form group with a unique name
      this.submitBooking.addControl('seat-' + (index + 1), seatForm);
      this.seatForms.push(seatForm);
    });
  }

  customNameValidator() {
    return (control: FormControl): { [key: string]: any } | null => {
      const namePattern = /^[a-zA-Z\s]*$/;
      const value = control.value;
      // Check if the value matches the name pattern
      if (!namePattern.test(value)) {
        // If the value doesn't match the pattern, return an error object
        // The error object indicates that the validation failed with the "invalidName" key
        return { invalidName: true };
      }
      // If the value matches the pattern, return null, indicating a successful validation
      return null;
    };
  }

  bookingTickets() {
    // Check if the booking data is valid
    if (this.submitBooking.valid) {
      // Prepare seat data array for submission
      this.seatDataArray = this.seatForms.map((seatForm) => seatForm.value);
      // Set the booking data in the service
      this.bookingService.seatFormData = this.seatDataArray;
      this.bookingService.totalAmount = this.totalPrice;
      // Show the confirmation screen
      this.showConfirm = true;
    }
  }

  paymentPage() {
    // Submit and confirm the booking
    this.bookingService.onEditData();
    alert('Your tickets have been booked...');
    this.paymentConfirm = true;
    this.bookingSummary = this.bookingService.bookedSeats;
    console.log(this.bookingSummary);
    // Clear the booking summary
    this.bookingSummary.splice(0, this.bookingSummary.length);
  }

  busList() {
    // Navigate to the list of buses
    this.route.navigate(['viewBus']);
  }

  logout() {
    // Log out the user
    this.authSerive.logOut();
  }
}
