import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  JobInformationService,
  CompareData,
  Range, 
  CompRequestData, 
  CompResponseData
} from '../../services/job-information.service';
import {
  education_degrees_f,
  federal_states_f,
} from '@shared/model/frontend_data';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapService } from 'app/services/map.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent {
  private readonly minimumFilterAmount = 1;
  readonly noSelectionText = "- Bitte Auswählen -";

  jobTitles$: Observable<string[]>;
  responseData$: Observable<CompResponseData>;
  responseData: CompareData[];

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
    salary_start: new FormControl(''),
    salary_end: new FormControl(''),
    age_start: new FormControl(''),
    age_end: new FormControl(''),
    job: new FormControl(''),
    state: new FormControl(''),
    education: new FormControl(''),
  })
  
  constructor(private jobInformationService: JobInformationService, private mapService: MapService) {
    this.federal_states = federal_states_f;
    this.education_degrees = education_degrees_f;
    this.jobTitles$ = this.jobInformationService.getJobTitles();
    this.responseData$ = of({results: []});
    this.responseData = [];
  }

  search(): void {
    if(this.getFilters().length >= this.minimumFilterAmount){
      let requestData: CompRequestData = {
        filters: this.getFilters(),
        resultTransformers: [{
          name: "list"
        }]
      }
      this.responseData$ = this.jobInformationService.getCompareData(requestData);
      this.responseData$.subscribe((response) => {
        this.responseData = response.results[0].results;
        console.log(this.responseData);
      });
    } else {
      //Toast-Service
      console.log("Filter Error!");
    }
  }

  getFilters(): any[] {
    let filters: any[] = [];
    let age = this.filterForm.value.age_start && this.filterForm.value.age_end && this.filterForm.value.age_end - this.filterForm.value.age_start > 0;
    let salary = this.filterForm.value.salary_start && this.filterForm.value.salary_end && this.filterForm.value.salary_end - this.filterForm.value.salary_start > 0;
    let job = this.filterForm.value.job && this.filterForm.value.job !== this.noSelectionText;
    let state = this.filterForm.value.state && this.filterForm.value.state !== this.noSelectionText;
    let education = this.filterForm.value.education && this.filterForm.value.education !== this.noSelectionText;
    if(salary){
      filters.push({
        name: "salary",
        min: this.filterForm.value.salary_start,
        max: this.filterForm.value.salary_end
      })
    }
    if(age){
      filters.push({
        name: "age",
        min: this.filterForm.value.age_start,
        max: this.filterForm.value.age_end
      })
    }
    if(job){
      filters.push({
        name: "jobTitle",
        desiredJobTitle: this.filterForm.value.job
      })
    }
    if(state){
      filters.push({
        name: "state",
        desiredState: this.mapService.mapFederalStateFtoB(this.filterForm.value.state)
      })
    }
    if(education){
      filters.push({
        name: "levelOfEducation",
        desiredLevelOfEducation: this.mapService.mapEducationDegreeFtoB(this.filterForm.value.education)
      })
    }
    console.log(filters)
    return filters;
  }
}
