import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
//managing the user signUp, signIn and also manages the tokens.
export class AuthService {
  // A subject to hold the currently authenticated user.
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  // Method for user registration (signup).
  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyA7MWws23nc1S9_w5CTKss9mR6mArtC5I8',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        //here pipe is used to perform muiltple operations to the observable chain
        catchError(this.handleError), //to handle the error if occurs at the time of SignUp process
        tap((resData) => {
          //tap is to call the helper method to handle user authentication.
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  // Method for user login.
  logIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyA7MWws23nc1S9_w5CTKss9mR6mArtC5I8',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleErrorLogIn),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  // Automatically log in a user based on their stored data in local storage.
  autoLogin() {
    // Check if there is user data stored in local storage.
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      // If no user data is found, return and do nothing.
      return;
    }

    // Create a user object using the stored data.
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    // Check if the user has a valid token.
    if (loadedUser.token) {
      // Set the user as authenticated.
      this.user.next(loadedUser);

      // Calculate the remaining token expiration time.
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();

      // Automatically log the user out when the token expires.
      this.autoLogout(expirationDuration);
    }
  }

  // Log the user out and clear their data.
  logOut() {
    // Clear the user by setting it to null.
    this.user.next(null);

    // Navigate to the main page or any desired route.
    this.router.navigate(['']);

    // Remove user data from local storage.
    localStorage.removeItem('userData');

    // Clear the token expiration timer if it exists.
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  // Automatically log the user out after the token expiration duration.
  autoLogout(expirationDuration: number) {
    // Set a timer to log the user out after the specified duration.
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  // Helper method to handle user authentication.
  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  // Helper method to handle HTTP error responses.
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = '';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
  private handleErrorLogIn(errorRes: HttpErrorResponse) {
    return throwError('Invalid email or password. Please try again.');
  }
}
