import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { SeatsService } from './BusSeats/Seats.servicce';

@Component({
  selector: 'app-viewBus',
  templateUrl: './viewBus.component.html',
  styleUrls: ['./viewBus.component.css'],
})
export class ViewBusComponent implements OnInit {
  searchStatus = false;
  BusesView;
  searchBus;
  constructor(
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    private busSelectedService: SeatsService
  ) {}
  ngOnInit() {
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
        this.BusesView = res;
        console.log(this.BusesView);
      });
  }
  returnBus(searchValue) {
    this.searchBus = [];
    this.searchStatus = true;
    searchValue.fromLoc = searchValue.fromLoc.toLowerCase();
    searchValue.toLoc = searchValue.toLoc.toLowerCase();
    for (let index of this.BusesView) {
      let val = index.FromLocation.toLowerCase();
      let val2 = index.ToLocation.toLowerCase();
      if (
        val.includes(searchValue.fromLoc) &&
        val2.includes(searchValue.toLoc)
      ) {
        this.searchBus.push(index);
      }
    }
  }
  OnShowItem(busValue) {
    this.busSelectedService.selectedBus = busValue;
    console.log(this.busSelectedService.selectedBus);
    this.route.navigate(['../busSeats'], { relativeTo: this.router });
  }
}
