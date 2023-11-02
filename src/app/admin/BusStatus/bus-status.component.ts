import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SeatFetchService } from './seat-fetch.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SearchStatusService } from 'src/app/viewBus/search/search-status.service';
import { SearchComponent } from 'src/app/viewBus/search/search.component';
@Component({
  selector: 'app-bus-status',
  templateUrl: './bus-status.component.html',
  styleUrls: ['./bus-status.component.css'],
})
export class BusStatusComponent implements OnInit {
  searchStatus = false; 
  busData; 
  searchBus; 
  showtable = false; 
  seatDetails; 
  showForm = false; 
  cancelForm: FormGroup; 
  cancelticket = false; 
  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  constructor(
    private http: HttpClient, 
    private seatView: SeatFetchService, 
    private authSerive: AuthService, 
    private route: Router, 
    private searchStatusService: SearchStatusService 
  ) {}

  ngOnInit(): void {
    // Subscribe to changes in search status
    this.searchStatusService.searchStatus.subscribe((status) => {
      this.searchStatus = status;
    });

    // Fetch bus data from the API
    this.http
      .get('https://ebusticketbooking-default-rtdb.firebaseio.com/Buses.json')
      .pipe(
        map((data) => {
          // Process and restructure the fetched data
          const dataEntryed = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              dataEntryed.push({ ...data[key], id: key });
            }
          }
          return dataEntryed;
        })
      )
      .subscribe((res) => {
        this.busData = res; // Store the fetched bus data
        this.seatView.totalBus = this.busData.length; // Set the total number of buses
        console.log(this.seatView.totalBus); // Log the total number of buses
      });

    // Initialize the seat cancellation form
    this.cancelForm = new FormGroup({
      SeatName: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  // Method to handle extracted bus data
  extractedBuses(bus) {
    this.showtable = !this.showtable; // Toggle the visibility of the bus details table
    this.seatView.selectedBus = bus; // Set the selected bus in the service
    this.seatView.fetchBusDetails(bus).subscribe((res) => {
      this.seatDetails = res; // Fetch and store details of selected bus seats
      const seatNumbers = this.seatDetails.map((item) => {
        // Extract and parse seat numbers from SeatNo
        const seatNumber = parseInt(item.SeatNo.replace(/\D/g, ''), 10);
        return seatNumber;
      });

      // Sort the this.fetchedSeatInfo array based on the parsed seat numbers. The sorting logic is provided as a callback function.
      // This function takes two parameters, seat1 and seat2, which represent two elements from this.fetchedSeatInfo that are being compared during the sorting process.
      this.seatDetails = this.seatDetails.sort(
        (seat1, seat2) =>
          seatNumbers[this.seatDetails.indexOf(seat1)] - //indexOf is used to find the index of elements
          seatNumbers[this.seatDetails.indexOf(seat2)]
        //These seat numbers are subtracted to determine the order of the seats
      );
    });
  }

  returnBus(searchValue) {
    this.searchBus = [];
    if (this.searchStatus) {
      searchValue.fromLoc = searchValue.fromLoc.toLowerCase(); //this will convert the string to lowerCase to preform validation
      searchValue.toLoc = searchValue.toLoc.toLowerCase();
      for (let index of this.busData) {
        let fromLoc = index.FromLocation.toLowerCase();
        let toLoc = index.ToLocation.toLowerCase();
        if (
          fromLoc.includes(searchValue.fromLoc) &&
          toLoc.includes(searchValue.toLoc)
        ) {
          this.searchBus.push(index); //if the user input matches with the object property the object get pushed into the searchBus array
        }
      } //To iterate the array of object fetched from DB which find the matches for the user input
    }
  }

  submitCancellation() {
    const seatName = this.cancelForm.value.SeatName.toUpperCase();
    const seatToCancel = this.seatDetails.find(
      (index) => index.SeatNo === '"' + seatName + '"'
    );

    if (seatToCancel) {
      // Set the flag to indicate a successful ticket cancellation.
      this.cancelticket = true;
      // Extract the seat number from the seat name.
      const extractedNumber = parseInt(seatName.match(/\d+/), 10) || 0;
      // Adjust the seat cancellation and update the seat details.
      this.seatView.cancellationAdjust(
        this.seatDetails,
        extractedNumber - 1,
        seatToCancel
      );
      this.seatView.cancellation(seatToCancel);

      // Update the seat details by fetching the latest data.
      this.seatView
        .fetchBusDetails(this.seatView.selectedBus.BusNo)
        .subscribe((res) => {
          this.seatDetails = res;
          this.cancelForm.reset(); // Reset the cancellation form.
          alert('Ticket has been cancelled.'); // Notify the user of a successful cancellation.
        });
    } else {
      this.cancelForm.reset(); // Reset the cancellation form if the seat is not found or not booked.
      alert('Seat Number entered was not valid or this seat is not booked...'); // Alert the user about the issue.
    }
  }

  // Method to log the user out
  logOut() {
    this.authSerive.logOut(); // Call the logout method from the authentication service
  }

  // Method to navigate to the 'addBus' route
  addbus() {
    this.route.navigate(['addBus']); // Navigate to the 'addBus' route when called
  }

  // Method to reset the search status and search results
  resetSearch() {
    this.searchStatus = false; // Reset the search status to false
    this.searchBus = []; // Clear the search results by emptying the 'searchBus' array
    this.searchComponent.resetForm();
  }

  // Function for tracking items in an *ngFor loop
  trackByFn(index: number, bus: any) {
    return bus.id; // Returns the unique identifier 'id' for tracking items in the loop
  }
}
