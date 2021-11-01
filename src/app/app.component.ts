import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, Subscription } from 'rxjs';
import { MemberService } from './services/member.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title: string = 'genpare';
  username?: string;
  subscription = new Subscription();

  constructor(public auth: AuthService, private memberService: MemberService) {
    this.subscription.add(
      this.memberService.getNickname().subscribe((name) => {
        console.log(name);
        this.username = name;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
