import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  JobInformationService,
  CompareData,
  CompRequestData,
} from '../../services/job-information.service';
import {
  education_degrees_f,
  federal_states_f,
} from '@shared/model/frontend_data';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MapService } from 'app/services/map.service';
import * as _ from 'lodash';
import { requireOneControl } from '@shared/validator-functions/require-one-control';
import { minSmallerMax } from '@shared/validator-functions/min-smaller-max';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent {
  readonly salaryMinimum = 0;
  readonly salaryMaximum = 1000000;
  readonly ageMinimum = 15;
  readonly ageMaximum = 100;
  private readonly minimumFilterAmount = 1;
  readonly noSelectionText = '- Bitte Auswählen -';

  initialState: boolean = true;

  jobTitles$: Observable<string[]>;
  tableData: CompareData[];

  readonly federal_states = federal_states_f;
  readonly education_degrees = education_degrees_f;

  readonly table_headers: string[] = [
    'Beruf',
    'Ausbildungsgrad',
    'Alter',
    'Bundesland',
    'Gehalt',
    'Geschlecht',
  ];

  filterForm = this.fb.group(
    {
      salary: this.fb.group(
        {
          salary_start: [
            '',
            [
              Validators.min(this.salaryMinimum),
              Validators.max(this.salaryMaximum),
            ],
          ],
          salary_end: [
            '',
            [
              Validators.min(this.salaryMinimum),
              Validators.max(this.salaryMaximum),
            ],
          ],
        },
        { validators: minSmallerMax('salary_start', 'salary_end') }
      ),
      age: this.fb.group(
        {
          age_start: [
            '',
            [Validators.min(this.ageMinimum), Validators.max(this.ageMaximum)],
          ],
          age_end: [
            '',
            [Validators.min(this.ageMinimum), Validators.max(this.ageMaximum)],
          ],
        },
        { validators: minSmallerMax('age_start', 'age_end') }
      ),

      job: ['', []],
      state: ['', []],
      education: ['', []],
    },
    {
      validators: requireOneControl(),
    }
  );

  get formControls(): { [key: string]: AbstractControl } {
    return this.filterForm.controls;
  }

  get ageControls(): AbstractControl | null {
    return this.filterForm.get('age');
  }

  get salaryControls(): AbstractControl | null {
    return this.filterForm.get('salary');
  }

  constructor(
    private jobInformationService: JobInformationService,
    private mapService: MapService,
    private fb: FormBuilder
  ) {
    this.federal_states = federal_states_f;
    this.education_degrees = education_degrees_f;
    this.jobTitles$ = this.jobInformationService.getJobTitles();
    this.tableData = [];
  }

  resetFilters(): void {
    this.filterForm.reset();
  }

  search(): void {
    if (this.filterForm.valid) {
      let requestData: CompRequestData = {
        filters: this.getFilters(),
        resultTransformers: [
          {
            name: 'list',
          },
        ],
      };
      this.jobInformationService
        .getCompareData(requestData)
        .subscribe((data) => {
          this.tableData = data;
          this.initialState = false;
        });
    }
  }

  private makeSalaryFilter(salaryValues: {
    salary_start: number;
    salary_end: number;
  }) {
    const salaryStep = 500;
    if (salaryValues.salary_end && !salaryValues.salary_start) {
      let carry = salaryValues.salary_end % salaryStep;
      salaryValues.salary_end += carry !== 0 ? salaryStep - carry : 0;
      salaryValues.salary_start = this.salaryMinimum;
      this.salaryControls?.patchValue({
        salary_end: salaryValues.salary_end,
      });
    } else if (salaryValues.salary_start && !salaryValues.salary_end) {
      let carry = salaryValues.salary_start % salaryStep;
      salaryValues.salary_start -= carry;
      salaryValues.salary_end = this.salaryMaximum;
      this.salaryControls?.patchValue({
        salary_start: salaryValues.salary_start,
      });
    } else if (salaryValues.salary_end && salaryValues.salary_start) {
      let carry_start = salaryValues.salary_start % salaryStep;
      let carry_end = salaryValues.salary_end % salaryStep;
      salaryValues.salary_start -= carry_start;
      salaryValues.salary_end += carry_end !== 0 ? salaryStep - carry_end : 0;
      this.salaryControls?.patchValue({
        salary_end: salaryValues.salary_end,
        salary_start: salaryValues.salary_start,
      });
    }
    return {
      name: 'salary',
      min: salaryValues.salary_start,
      max: salaryValues.salary_end,
    };
  }

  private makeAgeFilter(ageValues: { age_start: number; age_end: number }) {
    const ageStep = 5;
    if (ageValues.age_end && !ageValues.age_start) {
      let carry = ageValues.age_end % ageStep;
      ageValues.age_end += carry !== 0 ? ageStep - carry : 0;
      ageValues.age_start = this.ageMinimum;
      this.ageControls?.patchValue({
        age_end: ageValues.age_end,
      });
    } else if (ageValues.age_start && !ageValues.age_end) {
      let carry = ageValues.age_start % ageStep;
      ageValues.age_start -= carry;
      ageValues.age_end = this.ageMaximum;
      this.ageControls?.patchValue({
        age_start: ageValues.age_start,
      });
    } else if (ageValues.age_start && ageValues.age_end) {
      let carry_start = ageValues.age_start % ageStep;
      let carry_end = ageValues.age_end % ageStep;
      ageValues.age_start -= carry_start;
      ageValues.age_end += carry_end !== 0 ? ageStep - carry_end : 0;
      this.ageControls?.patchValue({
        age_start: ageValues.age_start,
        age_end: ageValues.age_end,
      });
    }
    return {
      name: 'age',
      min: ageValues.age_start,
      max: ageValues.age_end,
    };
  }

  private getFilters(): any[] {
    const filters: any[] = [];

    const values = { ...this.filterForm.value };

    if (values.salary.salary_start || values.salary.salary_end) {
      filters.push(this.makeSalaryFilter(values.salary));
    }

    if (values.age.age_start || values.age.age_end) {
      filters.push(this.makeAgeFilter(values.age));
    }

    if (values.job) {
      filters.push({
        name: 'jobTitle',
        desiredJobTitle: values.job,
      });
    }

    if (values.state) {
      filters.push({
        name: 'state',
        desiredState: this.mapService.mapFederalStateFtoB(values.state),
      });
    }

    if (values.education) {
      filters.push({
        name: 'levelOfEducation',
        desiredLevelOfEducation: this.mapService.mapEducationDegreeFtoB(
          values.education
        ),
      });
    }
    if (filters.length < this.minimumFilterAmount) {
      //Error: zu wenig Filter
      throw new Error('zu wenig filter');
    }
    return filters;
  }
}
