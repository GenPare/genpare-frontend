import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, Subscription } from 'rxjs';
import { MemberService } from './services/member.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title: string = 'genpare';
  nickname$: Observable<string>;
  defaultNickname: string;
  subscription = new Subscription();

  constructor(public auth: AuthService, private memberService: MemberService) {
    this.nickname$ = this.memberService.nicknameSubject$;
    this.defaultNickname = this.memberService.defaultNickname;
  }

  logout() {
    this.memberService
      .invalidateSessionId()
      .subscribe(() => this.auth.logout());
  }
}
