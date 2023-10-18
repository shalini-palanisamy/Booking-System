import { Component } from '@angular/core';

@Component({
  selector: 'app-authIn',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  logInRenderUser = true; // Indicates if the user login form should be displayed.
  logInRenderAdmin = false; // Indicates if the admin login form should be displayed.

  // Switch to the user login form.
  user() {
    this.logInRenderUser = true;
    this.logInRenderAdmin = false;
  }

  // Switch to the admin login form.
  admin() {
    this.logInRenderAdmin = true;
    this.logInRenderUser = false;
  }
}
