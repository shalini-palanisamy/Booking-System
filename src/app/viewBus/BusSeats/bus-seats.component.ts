import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/auth/auth.service';
import { SeatsService } from './seats.service';

@Component({
  selector: 'app-bus-seats',
  templateUrl: './bus-seats.component.html',
  styleUrls: ['./bus-seats.component.css'],
})
export class BusSeatsComponent implements OnInit {
  fetchedSeatInfo; //hold the seat information of the selected bus
  busDetails; //hold the selected bus information
  selectedSeats: any[] = []; //array to hold the seats selected by the user
  totalSeats = 0;
  seater = 0;
  sleeper = 0;
  styleCache: { [key: string]: string } = {};

  constructor(
    private seatService: SeatsService,
    private route: Router,
    private router: ActivatedRoute,
    private authSerive: AuthService // Authentication service
  ) {}

  ngOnInit(): void {
    this.fetchSeatStructure();
  }

  fetchSeatStructure() {
    // Subscribe to the seatService to fetch seat information
    this.seatService.fetchSeatInfo().subscribe((res) => {
      // Store the fetched seat information in this.fetchedSeatInfo
      this.fetchedSeatInfo = res;

      // Extract seat numbers from SeatNo and parse them into an array
      const seatNumbers = this.fetchedSeatInfo.map((item) => {
        return parseInt(item.SeatNo.replace(/\D/g, ''), 10); //remove any non-numeric characters from SeatNo and parse them into an array
      });

      // Sort the this.fetchedSeatInfo array based on the parsed seat numbers. The sorting logic is provided as a callback function.
      // This function takes two parameters, seat1 and seat2, which represent two elements from this.fetchedSeatInfo that are being compared during the sorting process.
      this.fetchedSeatInfo = this.fetchedSeatInfo.sort(
        (seat1, seat2) =>
          seatNumbers[this.fetchedSeatInfo.indexOf(seat1)] - //indexOf is used to find the index of elements
          seatNumbers[this.fetchedSeatInfo.indexOf(seat2)]
        //These seat numbers are subtracted to determine the order of the seats
      );

      // Store selected bus details in this.busDetails to use them in DOM
      this.busDetails = this.seatService.selectedBus;
    });
  }

  onCheckboxChange(event: any, index: number) {
    // Check if the checkbox is checked
    if (event.target.checked) {
      // Check if the number of selected seats is less than 5
      if (this.selectedSeats.length < 5) {
        // Check the type of the selected seat (seater or sleeper) and update counters
        if (this.fetchedSeatInfo[index].SeatType === 'seater') {
          ++this.seater; // Increment the seater count
        } else {
          ++this.sleeper; // Increment the sleeper count
        }
        ++this.totalSeats; // Increment the total selected seats count

        this.selectedSeats.push(this.fetchedSeatInfo[index]); // Add the selected seat to the 'selectedSeats' array
      } else {
        // Alert the user that they can book only 5 seats
        alert('One Can Book only 5 seats');
      }
    } else {
      // The checkbox is unchecked
      // Check if the selected seat was found
      if (this.selectedSeats.indexOf(this.fetchedSeatInfo[index]) !== -1) {
        // Check the type of the selected seat (seater or sleeper) and update counters
        if (this.fetchedSeatInfo[index].SeatType === 'seater') {
          --this.seater; // Decrement the seater count
        } else {
          --this.sleeper; // Decrement the sleeper count
        }
        --this.totalSeats; // Decrement the total selected seats count
        this.selectedSeats.splice(
          this.selectedSeats.indexOf(this.fetchedSeatInfo[index]),
          1
        ); // Remove the selected seat from the 'selectedSeats' array
      }
    }
  }

  getStyleSeater(item: any, index: number) {
    const cacheKey = `seater_${index}`; //creating a unique cache key based on the index parameter, seater_ - string prefix and ${index} - numerical value passed as a parameter

    // Check if the style is already cached, and return it if found
    if (this.styleCache[cacheKey]) {
      return this.styleCache[cacheKey];
    }

    // Initialize the style to an empty string
    let style: string = '';

    // Check if the seat is available for booking
    if (item.BookingStatus === false) {
      // Check if the seat number contains 'W' (window seat)
      if (item.SeatNo.includes('W')) {
        // Check if the adjacent seat is booked by a female passenger
        if (
          this.fetchedSeatInfo[index + 1].BookingStatus &&
          this.fetchedSeatInfo[index + 1].CustGender === 'female'
        ) {
          style = 'pink'; // Apply pink style for a female passenger
          this.seatService.updateGender(item, 'female');
        } else if (
          this.fetchedSeatInfo[index + 1].BookingStatus &&
          this.fetchedSeatInfo[index + 1].CustGender === 'male'
        ) {
          style = 'blue'; // Apply blue style for a male passenger
          this.seatService.updateGender(item, 'male');
        }
      } else {
        // The seat is not a window seat; check the status of the adjacent seat
        if (
          this.fetchedSeatInfo[index - 1].BookingStatus &&
          this.fetchedSeatInfo[index - 1]?.CustGender === 'female'
        ) {
          style = 'pink'; // Apply pink style for a female passenger
          this.seatService.updateGender(item, 'female');
        } else if (
          this.fetchedSeatInfo[index - 1].BookingStatus &&
          this.fetchedSeatInfo[index - 1]?.CustGender === 'male'
        ) {
          style = 'blue'; // Apply blue style for a male passenger
          this.seatService.updateGender(item, 'male');
        }
      }
    }

    // Cache the calculated style for future use
    this.styleCache[cacheKey] = style;

    // Return the determined style for the seat
    return style;
  } //ensures that the style for each seat is stored separately.

  getStyleSleeper(item: any, index: number) {
    const cacheKey = `sleeper_${index}`;

    // Check if the style is already cached, and return it if found
    if (this.styleCache[cacheKey]) {
      return this.styleCache[cacheKey];
    }

    // Initialize the style to an empty string
    let style: string = '';

    // Check if the seat is available for booking
    if (item.BookingStatus === false) {
      // Check if the seat number contains 'W' (window seat)
      if (item.SeatNo.includes('W')) {
        // Check if the adjacent seat is booked by a female or male passenger
        if (this.fetchedSeatInfo[index + 1].BookingStatus) {
          if (this.fetchedSeatInfo[index + 1].CustGender === 'female') {
            style = 'pink'; // Apply pink style for a female passenger
            this.seatService.updateGender(item, 'female');
          } else if (this.fetchedSeatInfo[index + 1].CustGender === 'male') {
            style = 'blue'; // Apply blue style for a male passenger
            this.seatService.updateGender(item, 'male');
          }
        }
      } else if (
        // Check if the seat number contains specific values
        item.SeatNo.includes('25') ||
        item.SeatNo.includes('28') ||
        item.SeatNo.includes('31') ||
        item.SeatNo.includes('34') ||
        item.SeatNo.includes('37')
      ) {
        // Check if the adjacent seat is booked by a female or male passenger
        if (this.fetchedSeatInfo[index - 1]?.BookingStatus) {
          if (this.fetchedSeatInfo[index - 1]?.CustGender === 'female') {
            style = 'pink'; // Apply pink style for a female passenger
            this.seatService.updateGender(item, 'female');
          } else if (this.fetchedSeatInfo[index - 1]?.CustGender === 'male') {
            style = 'blue'; // Apply blue style for a male passenger
            this.seatService.updateGender(item, 'male');
          }
        }
      }
    }

    // Cache the calculated style for future use
    this.styleCache[cacheKey] = style;

    // Return the determined style for the sleeper seat
    return style;
  }

  confirmSeats() {
    // Copy the selected seats to the service for booking
    this.seatService.selectedSeats = [...this.selectedSeats];

    // Copy the seat structure to the service for booking
    this.seatService.seatStucture = this.fetchedSeatInfo;

    // Check if at least one seat is selected
    if (this.selectedSeats.length) {
      // Navigate to the bookingSeat component
      this.route.navigate(['../bookingSeat'], { relativeTo: this.router });
    } else {
      // Alert the user that no seats are selected
      alert('No seats are selected...');
    }
  }

  logout() {
    // Log out the user
    this.authSerive.logOut();
  }

  trackByFn(index: number, seat: any): any {
    return seat.id;
  }
}
