import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BusStatusComponent } from './BusStatus/bus-status.component';
import { AddBusComponent } from './addBus/add-bus.component';
import { SearchModule } from '../shared/search/search.module';
import { AuthGuard } from '../auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { LogInModule } from '../shared/logIn/logIn.module';

const childRoutes: Routes = [
  {
    path: 'busStatus',
    component: BusStatusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addBus',
    component: AddBusComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  declarations: [BusStatusComponent, AddBusComponent],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SearchModule,
    LogInModule,
    RouterModule.forChild(childRoutes),
  ],
})
export class AdminModule {}
