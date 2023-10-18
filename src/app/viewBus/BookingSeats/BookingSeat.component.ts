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
  submitBooking: FormGroup; // Form group for submitting booking data
  selectedSeats; // Array to store selected seats
  selectedBus; // Store the selected bus
  seatForms: FormGroup[] = []; // Form groups for individual seat information
  totalPrice = 0; // Total price for selected seats
  showConfirm = false; // Indicates whether to show the confirmation screen
  seatDataArray; // Array to store seat data for submission
  paymentConfirm = false; // Indicates whether payment is confirmed
  bookingSummary; // Stores booking summary data
  formBuilder = inject(FormBuilder); // Form builder for creating form groups
  errorMessages = {
    required: 'This field is required.',
    minlength: 'Minimum length should be 3 characters.',
    min: 'Minimum age is 5.',
    invalidName: 'Invalid name format (only letters and spaces).',
    maxlength: 'Maximum length should be 15 characters.',
    maxAge: 'Maximum age is 120.',
    pattern: 'Invalid age format. Please enter a valid number.',
  };

  constructor(
    private seatSerives: SeatsService, // Seat service for seat-related data
    private bookingService: BookingEditSerive, // Service for editing and managing bookings
    private route: Router, // Router for navigation
    private authSerive: AuthService // Authentication service
  ) {}

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
    this.bookingService.OnEditData();
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
