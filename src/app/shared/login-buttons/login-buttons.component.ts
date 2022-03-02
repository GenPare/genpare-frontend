import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-buttons',
  templateUrl: './login-buttons.component.html',
  styleUrls: ['./login-buttons.component.scss'],
})
export class LoginButtonsComponent {
  constructor(public auth: AuthService) {}

  loginWithRedirect() {
    this.auth.loginWithRedirect({ appState: { target: '/success' } });
  }

  registerWithRedirect() {
    this.auth.loginWithRedirect({ screen_hint: 'signup', target: '/success' });
  }
}
