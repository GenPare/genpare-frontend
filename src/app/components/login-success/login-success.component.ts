import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MemberService } from 'app/services/member.service';

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
    this.memberService.setSessionId();
    this.auth.getAccessTokenSilently().subscribe((token) => {
      sessionStorage.setItem('access_token', token);
      this.router.navigateByUrl('/profile');
    });
  }
}
