import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerComponent } from './loadingSpinner/loading-spinner.component';
import { SignInComponent } from './signUp/signUp.component';
import { LogInModule } from '../shared/logIn/logIn.module';

@NgModule({
  declarations: [LoadingSpinnerComponent, SignInComponent],
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, LogInModule],
})
export class AuthModule {}
