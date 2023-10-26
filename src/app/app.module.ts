import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { SearchModule } from './shared/search/search.module';
import { LogInModule } from './shared/logIn/logIn.module';
import { CoreModule } from './core.module';
import { AuthModule } from './auth/auth.model';
import { UserRoutingModule } from './viewBus/user-routing.module';
import { UserComponent } from './viewBus/user.component';

@NgModule({
  declarations: [AppComponent, AuthComponent, AdminComponent, UserComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    UserRoutingModule,
    AuthModule,
    SearchModule,
    AdminModule,
    LogInModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
