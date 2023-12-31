import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // Implement the CanActivate interface to protect routes.
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1), //take only the first value emitted by the observable and then complete the observable and unsubcribe it automatically mainly to prevent memory leaks
      map((user) => {
        // Check if the user is authenticated (logged in).
        if (!!user) {
          return true; // Allow access to the route.
        } else {
          // If not authenticated, redirect to the main page.
          return this.router.createUrlTree(['']);
        }
      })
    );
  }
}
