import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth/auth.guard';
import { LogInComponent } from './shared/logIn/logIn.component';
import { SignInComponent } from './auth/signUp/signUp.component';
import { UserComponent } from './viewBus/user.component';

const appRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  { path: 'logIn', component: LogInComponent },
  { path: 'signIn', component: SignInComponent },
  {
    path: 'viewBus',
    component: UserComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./viewBus/user.module').then((m) => m.UserModule),
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
