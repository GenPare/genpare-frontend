import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemberService } from 'app/services/member.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss'],
})
export class LoginSuccessComponent implements OnInit {
  constructor(private memberService: MemberService, private router: Router) {}

  ngOnInit(): void {
    this.memberService
      .setSessionId()
      .pipe(catchError(() => of(undefined)))
      .subscribe(() => {
        this.router.navigateByUrl('/profile');
      });
  }
}
