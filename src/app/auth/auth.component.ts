import { Component } from '@angular/core';

@Component({
  selector: 'app-authIn',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  logInRenderUser = true;
  logInRenderAdmin = false;

  OnUser() {
    this.logInRenderUser = true;
    this.logInRenderAdmin = false;
  }
  OnAdmin() {
    this.logInRenderAdmin = true;
    this.logInRenderUser = false;
  }
}
