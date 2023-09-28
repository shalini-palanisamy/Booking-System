import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  isLoading = false;
  @Output() searchElement = new EventEmitter<object>();
  ngOnInit() {
    this.searchForm = new FormGroup({
      fromLoc: new FormControl(null, [Validators.required]),
      toLoc: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
    });
  }
  OnShow() {
    console.log(this.searchForm.value);
    this.searchElement.emit(this.searchForm.value);
  }
}
