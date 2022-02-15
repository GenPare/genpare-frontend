import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  JobInformationService,
  CompareData,
} from '../../services/job-information.service';
import {
  education_degrees_f,
  federal_states_f,
} from '@shared/model/frontend_data';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit {
  data$: Observable<CompareData[]>;
  jobTitles$: Observable<string[]>;

  federal_states: string[];
  education_degrees: string[];

  table_headers: string[] = [
    'Beruf',
    'Ausbildungsgrad',
    'Alter',
    'Bundesland',
    'Gehalt',
    'Geschlecht',
  ];

  filterForm =  new FormGroup({
    salary_start: new FormControl('', Validators.required),
    salary_end: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    job: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    education: new FormControl('', Validators.required),
  })
  
  constructor(private jobInformationService: JobInformationService, private fb: FormBuilder) {
    this.federal_states = federal_states_f;
    this.education_degrees = education_degrees_f;
    this.data$ = jobInformationService.getCompareData();
    this.jobTitles$ = this.jobInformationService.getJobTitles();
  }

  ngOnInit(): void {}

  search(): void {}
}
