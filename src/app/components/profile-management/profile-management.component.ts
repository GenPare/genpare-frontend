import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  education_degrees_f,
  federal_states_f,
  genders_f,
} from '@shared/model/frontend_data';
import { JobInformationService } from 'app/services/job-information.service';
import { MemberService } from 'app/services/member.service';
import { ToastService } from 'app/services/toast.service';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type SaveButtonText = 'Speichern' | 'Aktualisieren';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent implements OnInit, OnDestroy {
  email$: Observable<string>;
  subscriptions = new Subscription();

  education_degrees = education_degrees_f;
  federal_states = federal_states_f;
  genders = genders_f;

  profileForm = this.fb.group({
    job_title: ['', Validators.required],
    education_degree: ['', Validators.required],
    federal_state: ['', Validators.required],
    salary: ['', Validators.required],
    gender: ['', Validators.required],
    age: ['', Validators.required],
    nickname: ['', Validators.required],
  });
  
  isRegistered: boolean;
  saveButtonText: SaveButtonText;

  constructor(
    private memberService: MemberService,
    private dataManagementService: JobInformationService,
    private router: Router,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.email$ = this.memberService.getEmail();
    if (this.memberService.getSessionId()) {
      this.isRegistered = true;
      this.saveButtonText = 'Aktualisieren';
    } else {
      this.isRegistered = false;
      this.saveButtonText = 'Speichern';
    }
  }

  ngOnInit(): void {
    if (this.isRegistered) {
      this.subscriptions.add(
        this.memberService.nickname$.subscribe((nickname) => {
          this.profileForm.patchValue({ nickname });
        })
      );
      this.profileForm.get('nickname')?.disable();
      this.profileForm.get('age')?.disable();
      this.profileForm.get('gender')?.disable();
      this.fillForm();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private fillForm(): void {
    const member$ = this.memberService.getMemberInfo();
    const salary$ = this.dataManagementService.getJobInformation();
    this.subscriptions.add(
      combineLatest([member$, salary$]).subscribe(([memberInfo, jobInfo]) => {
        this.profileForm.patchValue({
          federal_state: jobInfo.state,
          salary: jobInfo.salary,
          education_degree: jobInfo.levelOfEducation,
          job_title: jobInfo.jobTitle,
          gender: memberInfo.gender,
          age: memberInfo.birthdate,
        });
      })
    );
  }

  save(): void {
    if (!this.isRegistered) {
      if (this.profileForm.valid) {
        this.subscriptions.add(
          this.memberService
            .registerMember(
              this.profileForm.value.nickname,
              this.profileForm.value.age,
              this.profileForm.value.gender
            )
            .pipe(
              switchMap(() =>
                this.dataManagementService.newJobInformation({
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
              this.saveButtonText = 'Aktualisieren';
              this.isRegistered = true;
              this.router.navigateByUrl('/compare');
            })
        );
      } else {
        this.toastService.show('Bitte alle Felder ausfüllen', {
          classname: 'bg-danger text-light',
        });
      }
    }
  }
}
