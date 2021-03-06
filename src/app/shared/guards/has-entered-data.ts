import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MemberService } from 'app/services/member.service';
import { ToastService } from 'app/services/toast.service';

@Injectable()
export class HasEnteredDataGuard implements CanActivate {
  constructor(
    private toastService: ToastService,
    private memberService: MemberService,
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.memberService.getSessionId()) {
      return true;
    } else {
      this.auth.isAuthenticated$.subscribe((isAuth) => {
        if (isAuth) {
          this.toastService.showDanger(
            'Sie können erst Vergleichen, wenn Sie Ihre Daten eingeben haben.'
          );
        }
      });

      return this.router.parseUrl('/profile');
    }
  }
}
