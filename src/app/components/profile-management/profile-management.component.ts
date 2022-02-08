import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MemberService } from 'app/services/member.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent implements OnDestroy {
  email$: Observable<string>;
  nickname: string = '';
  account_created: Date = new Date();
  isRegistered = false;
  subscriptions = new Subscription();

  constructor(public auth: AuthService, private memberService: MemberService) {
    this.email$ = this.memberService.getEmail();
    this.isRegistered = this.memberService.getSessionId() ? true : false;
    this.subscriptions.add(
      this.memberService.nicknameSubject$.subscribe((nickname) => {
        this.nickname = nickname;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  onRegisteredEmitter(bool: boolean) {
    this.isRegistered = bool;
  }
}
