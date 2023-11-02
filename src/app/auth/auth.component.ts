import { Component } from '@angular/core';

@Component({
  selector: 'app-authIn',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  logInRenderUser = true; 
  logInRenderAdmin = false; 

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
