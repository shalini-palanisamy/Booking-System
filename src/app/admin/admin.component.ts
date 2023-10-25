import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthResponseData, AuthService } from '../auth/auth.service'; // Import required modules and services.

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  logInForm: FormGroup; // FormGroup to manage the login form controls.
  validateAdmin; // Placeholder for admin validation logic (not defined here).
  displayError = false; // Flag to indicate whether to display an error message.

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit() {
    // Initialize the login form with email and password fields and their respective validators.

    this.logInForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required, // Email is required.
        Validators.email, // Ensure that the email is a valid email address.
        Validators.maxLength(50), // Maximum character length for email.
      ]),
      password: new FormControl(null, [
        Validators.required, // Password is required.
        Validators.maxLength(20), // Maximum character length for the password.
      ]),
    });
  }

  // Function to handle the login form submission.
  submitLogIn() {
    console.log(this.logInForm);
    if (!this.logInForm.valid) {
      return; // If the form is not valid, do not proceed with login.
    }

    const email = this.logInForm.value.email; // Get the email from the form.
    const password = this.logInForm.value.password; // Get the password from the form.

    let authObs: Observable<AuthResponseData>;

    // Check if the provided email and password match admin credentials.
    if (email === 'idpuser@gmail.com' && password === 'IdpIndia@68') {
      // If they match, attempt to log in through the authentication service.
      authObs = this.authService.logIn(email, password);

      authObs.subscribe(
        (resData) => {
          console.log(resData); // Log the response data (e.g., successful login).
          this.route.navigate(['busStatus']); // Navigate to a different page after a successful login.
        },
        (errorMessage) => {
          console.log(errorMessage); // Log any error messages from the login attempt.
          this.logInForm.reset(); // Reset the form to clear input fields.
          this.logInForm.get('password').markAsUntouched(); // Mark the password field as untouched.
        }
      );
    } else {
      this.logInForm.reset(); // Reset the form to clear input fields.
      this.logInForm.get('password').markAsUntouched(); // Mark the password field as untouched.
      alert('Invalid User'); // Display an alert for an invalid user.
    }
  }
}
