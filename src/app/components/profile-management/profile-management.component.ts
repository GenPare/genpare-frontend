import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
  education_degrees_f,
  federal_states_f,
  genders_f,
} from '@shared/model/frontend_data';
import { maxAge } from '@shared/validator-functions/max-age';
import { minAge } from '@shared/validator-functions/min-age';
import { JobInformationService } from 'app/services/job-information.service';
import { MemberService } from 'app/services/member.service';
import { ToastService } from 'app/services/toast.service';
import * as _ from 'lodash';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

enum SaveButtonEnum {
  SAVE = 'Speichern',
  UPDATE = 'Aktualisieren',
}

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent implements OnInit, OnDestroy {
  private tooltipVisible = false;
  @ViewChild('tt', { static: false }) mytooltip?: NgbTooltip;

  email$: Observable<string>;
  subscriptions = new Subscription();

  readonly education_degrees = education_degrees_f;
  readonly federal_states = federal_states_f;
  readonly genders = genders_f;
  isRegistered: boolean = false;
  saveButtonText: SaveButtonEnum;
  formValuesChanged = false;

  profileForm = this.fb.group({
    job_title: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    ],
    education_degree: ['', Validators.required],
    federal_state: ['', Validators.required],
    salary: [
      '',
      [Validators.required, Validators.min(0), Validators.max(1000000)],
    ],
    gender: ['', Validators.required],
    age: ['', [Validators.required, minAge(15), maxAge(99)]],
    nickname: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
  });

  private uneditedValues?: {
    federal_state: string;
    salary: number;
    education_degree: string;
    job_title: string;
    gender: string;
  };

  constructor(
    private memberService: MemberService,
    private jobInformationService: JobInformationService,
    private router: Router,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.email$ = this.memberService.getEmail();
    if (this.memberService.getSessionId()) {
      this.isRegistered = true;
      this.saveButtonText = SaveButtonEnum.UPDATE;
    } else {
      this.isRegistered = false;
      this.saveButtonText = SaveButtonEnum.SAVE;
    }
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.profileForm.controls;
  }

  ngOnInit(): void {
    if (this.isRegistered) {
      this.subscriptions.add(
        this.memberService.nickname$.subscribe((nickname) => {
          this.profileForm.patchValue({ nickname });
        })
      );
      this.profileForm.get("age")?.disable()
      this.fillForm();
    }
    this.continuouslyCheckIfValuesChanged();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleTooltip() {
    if (this.tooltipVisible) {
      this.mytooltip?.close();
    } else {
      this.mytooltip?.open();
    }
  }

  save(): void {
    if (!this.isRegistered) {
      this.addNewProfile();
    } else {
      this.modifyProfile();
    }
  }

  private continuouslyCheckIfValuesChanged() {
    this.subscriptions.add(
      combineLatest([
        this.profileForm.valueChanges,
        this.memberService.nickname$,
      ]).subscribe(([formvalues, nickname]) => {
        const copmareValues = { ...this.uneditedValues, nickname };
        this.formValuesChanged = !_.isEqual(copmareValues, formvalues);
      })
    );
  }

  private fillForm(): void {
    const member$ = this.memberService.getMemberInfo();
    const salary$ = this.jobInformationService.getJobInformation();
    this.subscriptions.add(
      combineLatest([member$, salary$]).subscribe(([memberInfo, jobInfo]) => {
        this.uneditedValues = {
          federal_state: jobInfo.state,
          salary: jobInfo.salary,
          education_degree: jobInfo.levelOfEducation,
          job_title: jobInfo.jobTitle,
          gender: memberInfo.gender,
        };
        this.profileForm.patchValue({
          ...this.uneditedValues,
          age: memberInfo.birthdate,
        });
      })
    );
  }

  private addNewProfile() {
    this.subscriptions.add(
      this.memberService
        .registerMember(
          this.profileForm.value.nickname,
          this.profileForm.value.age,
          this.profileForm.value.gender
        )
        .pipe(
          switchMap(() =>
            this.jobInformationService.newJobInformation({
              jobTitle: this.profileForm.value.job_title,
              salary: this.profileForm.value.salary,
              levelOfEducation: this.profileForm.value.education_degree,
              state: this.profileForm.value.federal_state,
            })
          )
        )
        .subscribe(() => {
          this.toastService.show('Daten gespeichert!', {
            classname: 'bg-success text-light',
          });
          this.isRegistered = true;
          this.router.navigateByUrl('/compare');
        })
    );
  }

  private modifyProfile() {
    let editNicknameAndGender$: Observable<Object> = of({});
    let modifyJob$: Observable<Object> = of({});

    if (
      this.profileForm.get('nickname')?.dirty ||
      this.profileForm.get('gender')?.dirty
    ) {
      editNicknameAndGender$ = this.memberService.editNicknameAndGender(
        this.profileForm.value.nickname,
        this.profileForm.value.gender
      );
    }
    if (this.profileForm.dirty) {
      modifyJob$ = this.jobInformationService.modifyJobInformation({
        jobTitle: this.profileForm.value.job_title,
        salary: this.profileForm.value.salary,
        levelOfEducation: this.profileForm.value.education_degree,
        state: this.profileForm.value.federal_state,
      });
    }
    this.subscriptions.add(
      combineLatest([editNicknameAndGender$, modifyJob$]).subscribe(() => {
        this.toastService.show('Daten aktualisiert!', {
          classname: 'bg-success text-light',
        });
        this.router.navigateByUrl('/compare');
      })
    );
  }
}
