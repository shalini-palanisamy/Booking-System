import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchStatusService } from './search-status.service';

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
      fromLoc: new FormControl(null, [
        Validators.maxLength(15), // Maximum character length for 'name' field.
        Validators.required, // The 'name' field is required.
        Validators.minLength(3), // Minimum length of 3 characters for 'name' field.
        this.customNameValidator(), // Custom validation function for 'name'.
      ]),
      toLoc: new FormControl(null, [
        Validators.maxLength(15), // Maximum character length for 'name' field.
        Validators.required, // The 'name' field is required.
        Validators.minLength(3), // Minimum length of 3 characters for 'name' field.
        this.customNameValidator(), // Custom validation function for 'name'.
      ]),
    }); //Creating controls for reactive form
  }

  toEmitUserData() {
    this.searchStatusService.setSearchStatus(true);
    this.searchElement.emit(this.searchForm.value);
  } //to emit the value from user through form to parent component

  // Custom validation function for 'name' field.
  customNameValidator() {
    return (control: FormControl): { [key: string]: any } | null => {
      const namePattern = /^[a-zA-Z\s]*$/; // Regular expression pattern for valid names (letters and spaces).
      const value = control.value;
      if (!namePattern.test(value)) {
        return { invalidName: true }; // Return an error if the name is invalid.
      }
      return null; // Name is valid.
    };
  }

  resetForm() {
    this.searchForm.reset(); // This will reset the form to its initial state.
  }
}
