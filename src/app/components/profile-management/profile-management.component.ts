import { Component } from '@angular/core';
import { MemberService } from 'app/services/member.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {
  password: string = '********';
  nickname?: string;
  creationDate: Date = new Date();
  isRegistered: boolean = false;
  email$: Observable<string>;

  constructor(public memberService: MemberService) {
    this.email$ = memberService.getEmail();
  }

  onRegisteredEmitter (bool: boolean) {
    this.isRegistered = bool;
  }

  
}
