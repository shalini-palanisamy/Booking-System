import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template:
    '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>',
  styleUrls: ['./loadingSpinner.component.css'],
})
export class LoadingSpinnerComponent {}
