import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-logIn',
  templateUrl: './logIn.component.html',
  styleUrls: ['./logIn.component.css'],
})
export class LogInComponent implements OnInit {
  logInForm: FormGroup; // A FormGroup to manage form controls for login.
  isLoading = false; // Indicates whether a login request is in progress.
  error = null; // Stores error messages, if any.

  constructor(
    private authService: AuthService, // Authentication service for user login.
    private route: Router // Router for navigation.
  ) {}

  ngOnInit() {
    // Initialize the login form with email and password fields.

    this.logInForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required, // Email field is required.
        Validators.email, // Ensure that the email is a valid email address.
        Validators.maxLength(50), // Maximum character length for email.
      ]),
      password: new FormControl(null, [
        Validators.required, // Password field is required.
        Validators.maxLength(20), // Maximum character length for password.
      ]),
    });
  }

  // Function to handle the login form submission.
  submitLogIn() {
    if (!this.logInForm.valid) {
      return; // If the form is not valid, do not proceed with login.
    }
    const email = this.logInForm.value.email; // Get the email from the form.
    const password = this.logInForm.value.password; // Get the password from the form.

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true; // Set isLoading to true to indicate a login request is in progress.

    // Check if the provided email and password match a predefined user.
    if (email !== 'idpuser@gmail.com' && password !== 'IdpIndia@68') {
      // If not a predefined user, attempt to log in through the authentication service.
      authObs = this.authService.logIn(email, password);

      authObs.subscribe(
        (resData) => {
          console.log(resData);
          this.isLoading = false; // Set isLoading to false after the login request.
          this.route.navigate(['viewBus']); // Navigate to a different page after a successful login.
        },
        (errorMessage) => {
          console.log(errorMessage);
          this.error = errorMessage; // Store and display any error message from the login attempt.
          this.isLoading = false; // Set isLoading to false after the login request.
          this.logInForm.reset(); // Reset the form to clear input fields.
          this.logInForm.get('password').markAsUntouched(); // Mark the password field as untouched.
        }
      );
    } else {
      this.error = 'Invalid User'; // Display an error message for an invalid user.
      this.isLoading = false; // Set isLoading to false.
    }
  }
}
