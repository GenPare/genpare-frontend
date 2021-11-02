import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MemberService } from 'app/services/member.service';
import { education_degrees, federal_states, genders } from './select-options';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss'],
})
export class DataManagementComponent {
  @Input()
  nickname?: string;

  @Output()
  registeredEmitter = new EventEmitter<boolean>();

  education_degrees = education_degrees;
  federal_states = federal_states;
  genders = genders;

  data_management = new FormGroup({
    job_title: new FormControl('', Validators.required),
    education_degree: new FormControl('', Validators.required),
    federal_state: new FormControl('', Validators.required),
    salary: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
  });

  constructor(private memberService: MemberService) {}

  save(): void {
    if (!this.memberService.sessionID$) {
      if (this.nickname) {
        this.memberService.registerMember(
          this.nickname,
          this.data_management.value.age,
          this.data_management.value.gender
        );
        this.registeredEmitter.emit(true);
      }
    }
  }
}
