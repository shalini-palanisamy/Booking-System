import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-logIn',
  templateUrl: './logIn.component.html',
  styleUrls: ['./logIn.component.css'],
})
export class LogInComponent implements OnInit {
  logInForm: FormGroup;
  isLoading = false;
  error = null;
  constructor(
    private authService: AuthService,
    private route: Router,
    private router: ActivatedRoute
  ) {}
  ngOnInit() {
    this.logInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }
  Onsubmit() {
    if (!this.logInForm.valid) {
      return;
    }
    const email = this.logInForm.value.email;
    const password = this.logInForm.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (email !== 'idpuser@gmail.com' && password !== 'IdpIndia@68') {
      authObs = this.authService.login(email, password);

      authObs.subscribe(
        (resData) => {
          console.log(resData);
          this.isLoading = false;
          this.route.navigate(['viewBus']);
        },
        (errorMessage) => {
          console.log(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
      );
    } else {
      this.error = 'Invalid User';
      this.isLoading = false;
    }
    this.logInForm.reset();
  }
}
