import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MemberService } from 'app/services/member.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  nickname$: Observable<string>;

  constructor(public auth: AuthService, private memberService: MemberService) {
    this.nickname$ = this.memberService.nickname$;
  }

  logout() {
    this.memberService
      .invalidateSessionId().pipe(catchError((err) => of(undefined)))
      .subscribe(() => this.auth.logout());
  }
}
