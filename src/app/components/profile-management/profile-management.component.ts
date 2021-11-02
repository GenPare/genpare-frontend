import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MemberService } from 'app/services/member.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {
  email$: Observable<string>;
  password: string = '********';
  nickname: string = 'nickname1';
  account_created: Date = new Date();
  isRegistered = false;
  subscriptions = new Subscription();

  constructor(public auth: AuthService, private memberService: MemberService) {
    this.email$ = this.memberService.userEmail$;
    this.isRegistered = this.memberService.sessionID$ ? true : false;
    this.memberService
      .getNickname()
      .subscribe(
        (name) => (this.nickname = this.nickname === 'No Nickname' ? '' : name)
      );
  }
  onRegisteredEmitter(bool: boolean) {
    this.isRegistered = bool;
  }
}
