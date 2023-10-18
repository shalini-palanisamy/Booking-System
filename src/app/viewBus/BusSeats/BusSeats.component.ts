import { Component, OnInit } from '@angular/core';
import { SeatsService } from './Seats.servicce';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-busSeats',
  templateUrl: './BusSeats.component.html',
  styleUrls: ['./BusSeats.component.css'],
})
export class BusSeatsComponent implements OnInit {
  Stucture;
  BusDetails;
  selectedItems: any[] = [];
  TotalSeats = 0;
  seater = 0;
  sleeper = 0;
  styleCache: { [key: string]: string } = {};

  constructor(
    private seatService: SeatsService,
    private route: Router,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.Onfetch();
  }

  Onfetch() {
    this.seatService.OnFetchBus().subscribe((res) => {
      this.Stucture = res;
      console.log(this.Stucture);
      const seatNumbers = this.Stucture.map((item) => {
        const seatNumber = parseInt(item.SeatNo.replace(/\D/g, ''), 10);
        return seatNumber;
      });

      // Sort the this.structure array based on the parsed seat numbers
      this.Stucture.sort((a, b) => {
        const seatNumberA = seatNumbers[this.Stucture.indexOf(a)];
        const seatNumberB = seatNumbers[this.Stucture.indexOf(b)];
        return seatNumberA - seatNumberB;
      });

      console.log(this.Stucture);
      this.BusDetails = this.seatService.selectedBus;
    });
  }

  onCheckboxChange(event: any, index: number) {
    if (event.target.checked) {
      if (this.selectedItems.length < 5) {
        if (this.Stucture[index].SeatType === 'seater') ++this.seater;
        else ++this.sleeper;
        ++this.TotalSeats;
        this.selectedItems.push(this.Stucture[index]);
      } else {
        alert('One Can Book only 5 seats');
      }
    } else {
      const selectedIndex = this.selectedItems.indexOf(this.Stucture[index]);
      if (selectedIndex !== -1) {
        if (this.Stucture[index].SeatType === 'seater') --this.seater;
        else --this.sleeper;
        --this.TotalSeats;
        this.selectedItems.splice(selectedIndex, 1);
      }
    }
  }

  getStyleSeater(item: any, index: number) {
    const cacheKey = `seater_${index}`;

    // Check if the style is already cached
    if (this.styleCache[cacheKey]) {
      return this.styleCache[cacheKey];
    }

    let style: string = '';

    if (item.BookingStatus === false) {
      if (item.SeatNo.includes('W')) {
        if (
          this.Stucture[index + 1].BookingStatus &&
          this.Stucture[index + 1].CustGender === 'female'
        ) {
          style = 'pink';
          this.seatService.updateGender(item, 'female');
        } else if (
          this.Stucture[index + 1].BookingStatus &&
          this.Stucture[index + 1].CustGender === 'male'
        ) {
          style = 'blue';
          this.seatService.updateGender(item, 'male');
        }
      } else {
        if (
          this.Stucture[index - 1].BookingStatus &&
          this.Stucture[index - 1]?.CustGender === 'female'
        ) {
          style = 'pink';
          this.seatService.updateGender(item, 'female');
        } else if (
          this.Stucture[index - 1].BookingStatus &&
          this.Stucture[index - 1]?.CustGender === 'male'
        ) {
          style = 'blue';
          this.seatService.updateGender(item, 'male');
        }
      }
    }

    // Cache the style for this seat
    this.styleCache[cacheKey] = style;

    return style;
  }

  getStyleSleeper(item: any, index: number) {
    const cacheKey = `sleeper_${index}`;

    // Check if the style is already cached
    if (this.styleCache[cacheKey]) {
      return this.styleCache[cacheKey];
    }

    let style: string = '';

    if (item.BookingStatus === false) {
      if (item.SeatNo.includes('W')) {
        if (
          this.Stucture[index + 1].BookingStatus &&
          this.Stucture[index + 1].CustGender === 'female'
        ) {
          style = 'pink';
          this.seatService.updateGender(item, 'female');
        } else if (
          this.Stucture[index + 1].BookingStatus &&
          this.Stucture[index + 1].CustGender === 'male'
        ) {
          style = 'blue';
          this.seatService.updateGender(item, 'male');
        }
      } else if (
        item.SeatNo.includes('25') ||
        item.SeatNo.includes('28') ||
        item.SeatNo.includes('31') ||
        item.SeatNo.includes('34') ||
        item.SeatNo.includes('37')
      ) {
        if (
          this.Stucture[index - 1]?.BookingStatus &&
          this.Stucture[index - 1]?.CustGender === 'female'
        ) {
          style = 'pink';
          this.seatService.updateGender(item, 'female');
        } else if (
          this.Stucture[index - 1]?.BookingStatus &&
          this.Stucture[index - 1]?.CustGender === 'male'
        ) {
          style = 'blue';
          this.seatService.updateGender(item, 'male');
        }
      }
    }

    // Cache the style for this seat
    this.styleCache[cacheKey] = style;

    return style;
  }

  CheckValue() {
    this.seatService.SelectedSeats = [...this.selectedItems];
    this.seatService.SeatStucture = this.Stucture;
    if (this.selectedItems.length)
      this.route.navigate(['../bookingSeat'], { relativeTo: this.router });
    else alert('No seats are selected...');
  }
  
}
