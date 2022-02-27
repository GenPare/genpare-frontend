import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MemberService } from 'app/services/member.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss'],
})
export class LoginSuccessComponent implements OnInit {
  constructor(
    private memberService: MemberService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.getAccessTokenSilently().pipe(tap((token) => {
      console.log("log")
      sessionStorage.setItem('access_token', token)})).pipe(switchMap(() => this.memberService.setSessionId()))
      .subscribe(() => this.router.navigateByUrl('/profile'));
    ;
  }
}
