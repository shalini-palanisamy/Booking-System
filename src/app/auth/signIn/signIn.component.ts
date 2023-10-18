import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signIn',
  templateUrl: './signIn.component.html',
  styleUrls: ['./signIn.component.css'],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  error = null;
  isLoading = false;

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit() {
    this.signInForm = new FormGroup({
      name: new FormControl(null, [
        Validators.maxLength(15),
        Validators.required, // Required validation
        Validators.minLength(3), // Minimum length of 3 characters
        this.customNameValidator(), // Custom name validation function
      ]),
      email: new FormControl(null, [
        Validators.email,
        Validators.required,
        Validators.maxLength(50),
      ]),
      password: new FormControl(null, [
        Validators.maxLength(20),
        Validators.required,
        this.passwordFormField(),
      ]),
      confirmPassword: new FormControl(null),
    });

    this.signInForm
      .get('confirmPassword')
      .setValidators([
        Validators.required,
        this.matchConfirmPassword.bind(this),
      ]);
    this.signInForm.get('password').valueChanges.subscribe(() => {
      this.signInForm.get('confirmPassword').updateValueAndValidity();
    });

    this.signInForm.get('confirmPassword').valueChanges.subscribe(() => {
      this.signInForm.get('confirmPassword').updateValueAndValidity();
    });
  }

  customNameValidator() {
    return (control: FormControl): { [key: string]: any } | null => {
      const namePattern = /^[a-zA-Z\s]*$/;
      const value = control.value;
      if (!namePattern.test(value)) {
        return { invalidName: true };
      }
      return null;
    };
  }

  Onsubmit() {
    if (!this.signInForm.valid) {
      return;
    }
    const email = this.signInForm.value.email;
    const password = this.signInForm.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    authObs = this.authService.signUp(email, password);

    authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.route.navigate(['']);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    this.signInForm.reset();
  }

  passwordFormField() {
    return (control) => {
      const password = control.value as string;
      if (!password) {
        return null; // No validation error if the password is empty
      }
      const regex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(password)) {
        return { strongPassword: true };
      }
      return null; // Password is strong
    };
  }

  matchConfirmPassword(control: FormControl): { [s: string]: boolean } {
    if (control.value !== this.signInForm.get('password').value) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
