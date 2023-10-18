import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  logInForm: FormGroup;
  validateAdmin;
  displayError = false;
  constructor(private authService: AuthService, private route: Router) {}
  ngOnInit() {
    this.logInForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
    });
  }
  Onsubmit() {
    console.log(this.logInForm);
    if (!this.logInForm.valid) {
      return;
    }
    const email = this.logInForm.value.email;
    const password = this.logInForm.value.password;

    let authObs: Observable<AuthResponseData>;
    if (email === 'idpuser@gmail.com' && password === 'IdpIndia@68') {
      authObs = this.authService.login(email, password);
      authObs.subscribe(
        (resData) => {
          console.log(resData);
          this.route.navigate(['busStatus']);
        },
        (errorMessage) => {
          console.log(errorMessage);
          this.logInForm.reset();
          this.logInForm.get('password').markAsUntouched();
        }
      );
    } else {
      this.logInForm.reset();
      this.logInForm.get('password').markAsUntouched();
      alert('Invalid User');
    }
    // this.http
    //   .get(
    //     'https://ebusticketbooking-default-rtdb.firebaseio.com/Admin/-NfKDIcNtwH4ta-aU1zc.json'
    //   )
    //   .pipe(
    //     map((data) => {
    //       return data;
    //     })
    //   )
    //   .subscribe((res) => {
    //     this.validateAdmin = res;
    //     if (
    //       this.logInForm.value.email === this.validateAdmin.UserEmail &&
    //       this.logInForm.value.password === this.validateAdmin.passWord
    //     ) {
    //       this.route.navigate(['busStatus'], { relativeTo: this.router });
    //     } else {
    //       this.displayError = true;
    //     }
    //   });
  }
}
