import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { StartPageComponent } from '@comp/start-page/start-page.component';
import { CompareComponent } from '@comp/compare/compare.component';
import { ProfileManagementComponent } from '@comp/profile-management/profile-management.component';
import { ToastsContainerComponent } from './shared/toasts-container/toasts-container.component';
import { HasEnteredDataGuard } from './guards/has-entered-data';
import { SupportPageComponent } from './components/support-page/support-page.component';
import { HttpClientModule } from '@angular/common/http';
import { DataManagementComponent } from '@comp/data-management/data-management.component';
import { AuthModule } from '@auth0/auth0-angular';
import { environment as env } from 'environments/environment.dev';
import { LoginSuccessComponent } from './components/login-success/login-success.component';
import { IsLoggedIn } from './guards/is-logged-in';
import { LoginButtonsComponent } from './shared/login-buttons/login-buttons.component';

export const backendURL = "http://localhost:8080"


export class App {
  constructor() {}
}

@NgModule({
  declarations: [
    AppComponent,
    DataManagementComponent,
    ProfileManagementComponent,
    CompareComponent,
    StartPageComponent,
    ToastsContainerComponent,
    SupportPageComponent,
    LoginSuccessComponent,
    LoginButtonsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      ...env.auth
    }),
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    CommonModule
  ],
  providers: [DatePipe, HasEnteredDataGuard,IsLoggedIn],
  bootstrap: [AppComponent]
})
export class AppModule { }
