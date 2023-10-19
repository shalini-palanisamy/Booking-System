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
  signInForm: FormGroup; // This FormGroup will manage our form's controls.
  error = null; // This variable will store error messages.
  isLoading = false; // This variable will be used to indicate whether a form submission is in progress.

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit() {
    // Initialize the form controls and their associated validators.

    this.signInForm = new FormGroup({
      name: new FormControl(null, [
        Validators.maxLength(15), // Maximum character length for 'name' field.
        Validators.required, // The 'name' field is required.
        Validators.minLength(3), // Minimum length of 3 characters for 'name' field.
        this.customNameValidator(), // Custom validation function for 'name'.
      ]),
      email: new FormControl(null, [
        Validators.email, // Ensure that the 'email' is a valid email address.
        Validators.required, // The 'email' field is required.
        Validators.maxLength(50), // Maximum character length for 'email' field.
      ]),
      password: new FormControl(null, [
        Validators.maxLength(20), // Maximum character length for 'password' field.
        Validators.required, // The 'password' field is required.
        this.passwordFormField(), // Custom validation function for 'password'.
      ]),
      confirmPassword: new FormControl(null), // This field is used to confirm the 'password'.
    });

    // Set validators for the 'confirmPassword' field based on its value.

    this.signInForm.get('confirmPassword').setValidators([
      Validators.required, // The 'confirmPassword' field is required.
      this.matchConfirmPassword.bind(this), // Custom validation to ensure password confirmation matches.
    ]);

    // Subscribe to changes in the 'password' and 'confirmPassword' fields to update their validation dynamically.

    this.signInForm.get('password').valueChanges.subscribe(() => {
      this.signInForm.get('confirmPassword').updateValueAndValidity();
    });

    this.signInForm.get('confirmPassword').valueChanges.subscribe(() => {
      this.signInForm.get('confirmPassword').updateValueAndValidity();
    });
  }

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

  // Handle the form submission.
  submitSignUp() {
    if (!this.signInForm.valid) {
      return; // If the form is not valid, do not proceed with submission.
    }
    const email = this.signInForm.value.email; // Get the email from the form.
    const password = this.signInForm.value.password; // Get the password from the form.

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true; // Set isLoading to true to indicate a form submission is in progress.
    authObs = this.authService.signUp(email, password); // Call the authentication service to sign up.

    authObs.subscribe(
      (resData) => {
        this.isLoading = false; // Set isLoading to false after submission.
        this.route.navigate(['']); // Redirect to the home page after successful sign-up.
      },
      (errorMessage) => {
        this.error = errorMessage; // Store the error message in the 'error' variable.
        this.isLoading = false; // Set isLoading to false after submission.
      }
    );

    this.signInForm.reset(); // Reset the form after submission to clear input fields.
  }

  // Custom validation function for 'password' field.
  passwordFormField() {
    return (control) => {
      const password = control.value as string; // Get the password value.
      if (!password) {
        return null; // No validation error if the password is empty.
      }
      const regex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      // Regular expression pattern for a strong password.

      if (!regex.test(password)) {
        return { strongPassword: true }; // Return an error if the password is not strong.
      }
      return null; // Password is strong.
    };
  }

  // Custom validation function to confirm that the password and confirmPassword match.
  matchConfirmPassword(control: FormControl): { [s: string]: boolean } {
    if (control.value !== this.signInForm.get('password').value) {
      return { passwordMismatch: true }; // Return an error if passwords do not match.
    }
    return null; // Passwords match.
  }
}
