import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  education_degrees_f,
  federal_states_f,
  genders_f,
} from '@shared/model/frontend_data';
import {
  DataManagementService,
  ProfileData,
} from 'app/services/data-management.service';
import { MemberService } from 'app/services/member.service';
import { ToastService } from 'app/services/toast.service';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss'],
})
export class DataManagementComponent{
  @Input()
  nickname: string | undefined;

  @Output()
  registeredEmitter = new EventEmitter<boolean>();

  education_degrees = education_degrees_f;
  federal_states = federal_states_f;
  genders = genders_f;

  federal_state?: string;
  salary?: number;
  education_degree?: string;
  job_title?: string;

  existingData$: Observable<ProfileData>;

  data_management = new FormGroup({
    job_title: new FormControl('', Validators.required),
    education_degree: new FormControl('', Validators.required),
    federal_state: new FormControl('', Validators.required),
    salary: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
  });

  constructor(
    private memberService: MemberService,
    private dataManagementService: DataManagementService,
    private toastService: ToastService
  ) {
    this.federal_states = federal_states_f;
    this.genders = genders_f;
    this.education_degrees = education_degrees_f;
    this.existingData$ = this.dataManagementService.getProfileData();
    this.existingData$
      .pipe(
        tap((data) => {
          (this.federal_state = data.federal_state),
            (this.salary = data.salary),
            (this.education_degree = data.education_degree),
            (this.job_title = data.job_title);
        })
      )
      .subscribe();
  }

  save() {
    if (!this.memberService.getSessionId()) {
      if (this.nickname) {
        return this.memberService
          .registerMember(
            this.nickname,
            this.data_management.value.age,
            this.data_management.value.gender
          )
          .pipe(tap(() => this.toastService.show("Daten gespeichert!",{classname: 'bg-success text-light'})))
          .pipe(
            switchMap(() => {
              const newData = {
                job_title: this.data_management.value.job_title,
                salary: this.data_management.value.salary,
                education_degree: this.data_management.value.education_degree,
                federal_state: this.data_management.value.federal_state,
              };
              return this.dataManagementService.newProfileData(newData);
            })
          )
          .subscribe(() => this.registeredEmitter.emit(true));
      } else {
        this.toastService.show("Bitte einen Nickname angeben",{ classname: 'bg-danger text-light'})
      }
    }
    return EMPTY;
  }
}
