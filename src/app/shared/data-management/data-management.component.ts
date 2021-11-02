import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataManagementService } from 'app/data-management.service';
import {
  federal_states_f,
  education_degrees_f,
  genders_f,
} from '@shared/model/frontend_data';
import { ProfileData } from '../../data-management.service';
import { Observable, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss'],
})
export class DataManagementComponent implements OnInit {
  federal_states: string[];
  genders: string[];
  education_degrees: string[];

  federal_state?: string;
  salary?: number;
  education_degree?: string;
  job_title?: string;

  existingData$: Observable<ProfileData>;
  newData?: ProfileData;

  data_management = new FormGroup({
    job_title: new FormControl(''),
    education_degree: new FormControl(''),
    federal_state: new FormControl(''),
    salary: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl(''),
  });

  constructor(private dataManagementService: DataManagementService) {
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

  ngOnInit(): void {}

  save(): void {
    this.newData = {
      job_title: this.data_management.value.job,
      salary: this.data_management.value.salary,
      education_degree: this.data_management.value.education_degree,
      federal_state: this.data_management.value.federal_state,
    };
    this.dataManagementService.newProfileData(this.newData);
  }
}
