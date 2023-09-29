import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SeatsService } from '../BusSeats/Seats.servicce';
import { BookingEditSerive } from './BookingEdit.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  constructor(
    private seatSerives: SeatsService,
    private fb: FormBuilder,
    private BookingService: BookingEditSerive,
    private route: Router,
    private router: ActivatedRoute
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
  }
  customNameValidator() {
    return (control: FormControl): { [key: string]: any } | null => {
      const namePattern = /^[a-zA-Z\s]*$/; // Regex pattern to allow only letters and spaces
      const value = control.value;

      if (!namePattern.test(value)) {
        return { invalidName: true }; // Validation failed
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
