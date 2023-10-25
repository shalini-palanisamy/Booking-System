import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth/auth.guard';
import { LogInComponent } from './auth/logIn/logIn.component';
import { SignInComponent } from './auth/signUp/signUp.component';
import { ViewBusComponent } from './viewBus/view-bus.component';

const appRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  { path: 'logIn', component: LogInComponent },
  { path: 'signIn', component: SignInComponent },
  {
    path: 'viewBus',
    component: ViewBusComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./viewBus/view-bus.module').then((m) => m.ViewBusModule),
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
