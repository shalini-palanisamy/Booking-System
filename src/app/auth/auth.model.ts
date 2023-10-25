import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerComponent } from './loadingSpinner/loading-spinner.component';
import { LogInModule } from './logIn/logIn.module';

@NgModule({
  declarations: [LoadingSpinnerComponent],
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, LogInModule],
})
export class ViewBusModule {}
