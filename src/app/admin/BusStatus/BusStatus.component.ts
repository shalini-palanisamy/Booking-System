import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { BusSelectedService } from './BusSelected.service';
@Component({
  selector: 'app-busStatus',
  templateUrl: './BusStatus.component.html',
  styleUrls: ['./BusStatus.component.css'],
})
export class BusStatusComponent implements OnInit {
  busData;
  constructor(
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    private SelectedBusService: BusSelectedService
  ) {}
  ngOnInit(): void {
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
        this.busData = res;
      });
  }
  OnView(bus) {
    this.SelectedBusService.SelectedBus = bus;
    this.route.navigate(['../seatStatus'], { relativeTo: this.router });
  }
}
