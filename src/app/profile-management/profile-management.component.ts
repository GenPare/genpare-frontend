import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {
  email?: string = 'email@email.email';
  password: string = '********';
  nickname: string = 'nickname1';
  account_created: Date = new Date();

  constructor(public auth: AuthService) {
    auth.user$.subscribe((user) => (this.email = user?.email));
  }
}
