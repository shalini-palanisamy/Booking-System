import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LogInComponent } from './logIn.component';

@NgModule({
  declarations: [LogInComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [LogInComponent],
})
export class LogInModule {}
