import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  // Intercept HTTP requests and add authentication token if the user is authenticated.
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1), //take only the first value emitted by the observable and then complete the observable and unsubcribe it automatically mainly to prevent memory leaks
      exhaustMap((user) => {
        //to ensure that only one inner observable is being processed at a time, and any subsequent observables are ignored until the currently active inner observable completes
        if (!user) {
          return next.handle(req); // If the user is not authenticated, pass the request as-is.
        }
        // Clone the request and add the user's authentication token as a query parameter.
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token), //create query strings that can be appended
        });
        return next.handle(modifiedReq); // Pass the modified request.
      })
    );
  }
}
