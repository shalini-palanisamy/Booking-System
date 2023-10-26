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

  constructor(private http: HttpClient, private router: Router) {}

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
            resData.idToken
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
            resData.idToken
          );
        })
      );
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['']);
    localStorage.removeItem('userData');
  }
  // Helper method to handle user authentication.
  private handleAuthentication(email: string, userId: string, token: string) {
    const user = new User(email, userId, token);
    this.user.next(user);
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
