import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MemberService } from 'app/services/member.service';
import { education_degrees, federal_states, genders } from './select-options';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss'],
})
export class DataManagementComponent implements OnInit {
  education_degrees = education_degrees;
  federal_states = federal_states;
  genders = genders;

  data_management = new FormGroup({
    job: new FormControl('', Validators.required),
    education_degree: new FormControl('', Validators.required),
    federal_state: new FormControl('', Validators.required),
    salary: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
  });

  constructor(public memberService: MemberService) {}

  ngOnInit(): void {}

  test() {
    let a = this.memberService.getSessionID();
    a.subscribe(value => console.log(value))
  }

  save(): void {}
}
