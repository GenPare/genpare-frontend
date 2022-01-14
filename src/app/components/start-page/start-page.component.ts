import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent {
  constructor(public auth: AuthService) {
  }

  loginWithRedirect() {
    this.auth.loginWithRedirect({ appState: { target: '/success', } })
  }

  registerWithRedirect() {
    this.auth.loginWithRedirect({ screen_hint: 'signup', target:'/success' })
  }
}
