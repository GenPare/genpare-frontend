import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MemberService } from 'app/services/member.service';
import { ToastService } from 'app/services/toast.service';

@Injectable()
export class HasEnteredDataGuard implements CanActivate {
  constructor(
    private toastService: ToastService,
    private memberService: MemberService,
    private auth: AuthService
  ) {}

  canActivate(): boolean {
    if (this.memberService.getSessionId()) {
      return true;
    } else {
      this.auth.isAuthenticated$.subscribe((isAuth) => {
        if (isAuth) {
          this.toastService.show(
            'Sie können erst Vergleichen, wenn Sie Ihre Daten eingeben haben.',
            { classname: 'bg-danger text-light', delay: 15000 }
          );
        }
      });

      return false;
    }
  }
}
