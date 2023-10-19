import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchStatusService } from './searchstatus.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup; //formgroup variable name for searching a bus

  @Output() searchElement = new EventEmitter<object>(); //searchElement is the eventEmitter which is used to pass the data from child component to parent

  constructor(private searchStatusService: SearchStatusService) {}
  ngOnInit() {
    this.searchForm = new FormGroup({
      fromLoc: new FormControl(null, [Validators.required]),
      toLoc: new FormControl(null, [Validators.required]),
    }); //Creating controls for reactive form
  }

  toEmitUserData() {
    this.searchStatusService.setSearchStatus(true);
    this.searchElement.emit(this.searchForm.value);
  } //to emit the value from user through form to parent component
}
