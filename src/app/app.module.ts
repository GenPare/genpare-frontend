import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { StartPageComponent } from '@comp/start-page/start-page.component';
import { CompareComponent } from '@comp/compare/compare.component';
import { ProfileManagementComponent } from '@comp/profile-management/profile-management.component';
import { ToastsContainerComponent } from './shared/toasts-container/toasts-container.component';
import { HasEnteredDataGuard } from './guards/has-entered-data';
import { SupportPageComponent } from './components/support-page/support-page.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';
import { environment as env } from 'environments/environment';
import { LoginSuccessComponent } from './components/login-success/login-success.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

import { JwtModule } from '@auth0/angular-jwt';
import { IsLoggedIn } from './guards/is-logged-in';
import { LoginButtonsComponent } from './shared/login-buttons/login-buttons.component';

export function tokenGetter() {
  return sessionStorage.getItem('access_token');
}

export class App {
  constructor() {}
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileManagementComponent,
    CompareComponent,
    StartPageComponent,
    ToastsContainerComponent,
    SupportPageComponent,
    LoginSuccessComponent,
    NavBarComponent,
    LoginButtonsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      ...env.auth,
    }),
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8080'],
      },
    }),
    CommonModule,
  ],
  providers: [DatePipe, HasEnteredDataGuard, IsLoggedIn],
  bootstrap: [AppComponent],
})
export class AppModule {}
