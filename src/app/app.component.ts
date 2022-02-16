import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MemberService } from './services/member.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title: string = 'genpare';
  username$: Observable<string>;
  subscription = new Subscription();

  constructor(public auth: AuthService, private memberService: MemberService) {
    this.username$ = this.memberService.getNickname();
  }

  logout() {
    this.auth.logout()
    this.memberService
      .invalidateSessionId()
      .pipe(catchError(() => of(undefined)))
      .subscribe(() => {});
  }
}
