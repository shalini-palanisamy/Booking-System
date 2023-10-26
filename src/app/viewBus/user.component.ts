import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { SearchStatusService } from '../shared/search/search-status.service';
import { SeatsService } from './BusSeats/seats.service';
import { SearchComponent } from '../shared/search/search.component';

@Component({
  selector: 'app-view-bus',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  searchStatus = false; //to trace the status of the searching function
  busesFetched; //To hold the buses details
  searchResult; //To hold the buses which has been searched
  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  constructor(
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    private busSelectedService: SeatsService,
    private authSerive: AuthService,
    private searchStatusService: SearchStatusService
  ) {}

  ngOnInit() {
    this.searchStatusService.searchStatus.subscribe((status) => {
      this.searchStatus = status;
    });

    //To fetch the Bus details as an object of array from database
    this.http
      .get('https://ebusticketbooking-default-rtdb.firebaseio.com/Buses.json')
      .pipe(
        map((data) => {
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
        this.busesFetched = res;
      }); //subscribe the http request to get the response
  }

  extractedBuses(searchValue) {
    this.searchResult = [];
    //searchValue will holds the input from the user for from and to location
    searchValue.fromLoc = searchValue.fromLoc.toLowerCase(); //this will convert the string to lowerCase to preform validation
    searchValue.toLoc = searchValue.toLoc.toLowerCase();
    for (let index of this.busesFetched) {
      let fromLoc = index.FromLocation.toLowerCase();
      let toLoc = index.ToLocation.toLowerCase();
      if (
        fromLoc.includes(searchValue.fromLoc) &&
        toLoc.includes(searchValue.toLoc)
      ) {
        this.searchResult.push(index); //if the user input matches with the object property the object get pushed into the searchBus array
      }
    } //To iterate the array of object fetched from DB which find the matches for the user input
  } //this method is used to extract the searched bus and push them in an array to display them in DOM

  passSelectedBusData(busValue) {
    this.busSelectedService.selectedBus = busValue; //Updating service variable with the selected bus object
    this.route.navigate(['../busSeats'], { relativeTo: this.router }); //navigating to seat components
  } //This method is to navigate for seat component with selected bus data

  logOut() {
    this.authSerive.logOut(); //call the auth service logout method
  }

  resetSearch() {
    this.searchStatus = false;
    this.searchResult = [];
    this.searchComponent.resetForm();
  }

  trackByFn(index: number, busValue: any): any {
    return busValue.id;
  } //optimize rendering and improve performance when working with lists of dynamic data.
}
