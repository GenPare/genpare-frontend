import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MemberService } from 'app/services/member.service';
import { Subscription } from 'rxjs';

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
  isRegistered = false;
  subscriptions = new Subscription();

  constructor(public auth: AuthService, private memberService: MemberService) {
    this.subscriptions.add(
      auth.user$.subscribe((user) => (this.email = user?.email))
    );
    this.subscriptions.add(
      this.memberService
        .getSessionId()
        .subscribe((id) => (this.isRegistered = id ? true : false))
    );
  }
}
