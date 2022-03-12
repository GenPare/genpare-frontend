import { Component, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import {
  JobInformationService,
  CompareData,
  CompRequestData,
} from '../../services/job-information.service';
import {
  education_degrees_f,
  federal_states_f,
} from '@shared/model/frontend_data';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MapService } from 'app/services/map.service';
import { ToastService } from 'app/services/toast.service';

function minSmallerMax(
  minControlName: string,
  maxControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const minControl = control.get(minControlName);
    const maxControl = control.get(maxControlName);
    if (minControl?.value && maxControl?.value) {
      if (minControl.value > maxControl.value) {
        const error = {
          minSmallerMax: {
            minControl: minControlName,
            minimumValue: minControl.value,
            maxControl: maxControlName,
            maximumValue: maxControl.value,
          },
        };
        return error;
      }
    }
    return null;
  };
}

function requireOneControl(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    let filledControls: number = 0;
    for (const [key, value] of Object.entries(formGroup.value)) {
      if (value !== '' && value !== null) {
        filledControls += 1;
      }
    }
    return filledControls === 0
      ? {
          requireOneControl: {
            requiredControls: filledControls,
            actualControls: 1,
          },
        }
      : null;
  };
}

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnDestroy {
  readonly salaryMinimum = 0;
  readonly salaryMaximum = 1000000;
  readonly ageMinimum = 15;
  readonly ageMaximum = 100;
  private readonly minimumFilterAmount = 1;
  readonly noSelectionText = '- Bitte Auswählen -';

  initialState: boolean;

  formChangeSubscribtion: Subscription;

  jobTitles$: Observable<string[]>;
  responseData$: Observable<CompareData[]>;
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

  filterForm = this.fb.group(
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
      age_start: [
        '',
        [Validators.min(this.ageMinimum), Validators.max(this.ageMaximum)],
      ],
      age_end: [
        '',
        [Validators.min(this.ageMinimum), Validators.max(this.ageMaximum)],
      ],
      job: ['', []],
      state: ['', []],
      education: ['', []],
    },
    {
      validator: [
        minSmallerMax('salary_start', 'salary_end'),
        minSmallerMax('age_start', 'age_end'),
        requireOneControl(),
      ],
    }
  );

  get formControls(): { [key: string]: AbstractControl } {
    return this.filterForm.controls;
  }

  constructor(
    private jobInformationService: JobInformationService,
    private mapService: MapService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.federal_states = federal_states_f;
    this.education_degrees = education_degrees_f;
    this.jobTitles$ = this.jobInformationService.getJobTitles();
    this.responseData$ = of([]);
    this.responseData = [];
    this.initialState = true;
    this.formChangeSubscribtion = this.filterForm.valueChanges.subscribe(() => {
      if (this.filterForm.errors?.minSmallerMax) {
        if (this.filterForm.errors.minSmallerMax.minControl == 'age_start') {
          this.filterForm.controls.age_start.setErrors({
            minSmallerMax: 'true',
          });
          this.filterForm.controls.age_end.setErrors({ minSmallerMax: 'true' });
        } else {
          this.filterForm.controls.salary_start.setErrors({
            minSmallerMax: 'true',
          });
          this.filterForm.controls.salary_end.setErrors({
            minSmallerMax: 'true',
          });
        }
      } else {
        if (this.filterForm.controls.age_start.hasError('minSmallerMax') || this.filterForm.controls.age_end.hasError('minSmallerMax')){
          this.filterForm.controls.age_start.setErrors(null);
          this.filterForm.controls.age_end.setErrors(null);
        } else if (this.filterForm.controls.salary_start.hasError('minSmallerMax') || this.filterForm.controls.salary_end.hasError('minSmallerMax')){
          this.filterForm.controls.salary_start.setErrors(null);
          this.filterForm.controls.salary_end.setErrors(null);          
        }
        this.filterForm.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  ngOnDestroy(): void {
    this.formChangeSubscribtion.unsubscribe();
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
      this.responseData$ =
        this.jobInformationService.getCompareData(requestData);
      this.responseData$.subscribe((data) => {
        this.responseData = data;
        this.initialState = false;
      });
    }
  }

  getFilters(): any[] {
    // TODO in funktionen auslagern
    let filters: any[] = [];

    let values = { ...this.filterForm.value };
    const salaryStep = 500;
    if (values.salary_start || values.salary_end) {
      if (values.salary_end && !values.salary_start) {
        let carry = values.salary_end % salaryStep;
        values.salary_end += carry !== 0 ? salaryStep - carry : 0;
        values.salary_start = this.salaryMinimum;
        this.filterForm.patchValue({ salary_end: values.salary_end });
      } else if (values.salary_start && !values.salary_end) {
        let carry = values.salary_start % salaryStep;
        values.salary_start -= carry;
        values.salary_end = this.salaryMaximum;
        this.filterForm.patchValue({ salary_start: values.salary_start });
      } else if (values.salary_end && values.salary_start) {
        let carry_start = values.salary_start % salaryStep;
        let carry_end = values.salary_end % salaryStep;
        values.salary_start -= carry_start;
        values.salary_end += carry_end !== 0 ? salaryStep - carry_end : 0;
        this.filterForm.patchValue({
          salary_end: values.salary_end,
          salary_start: values.salary_start,
        });
      }
      filters.push({
        name: 'salary',
        min: values.salary_start,
        max: values.salary_end,
      });
    }
    const ageStep = 5;
    if (values.age_start || values.age_end) {
      if (values.age_end && !values.age_start) {
        let carry = values.age_end % ageStep;
        
        values.age_end += carry !== 0 ? ageStep - carry : 0;
        values.age_start = this.ageMinimum;
        this.filterForm.patchValue({
          age_end: values.age_end,
        });
      } else if (values.age_start && !values.age_end) {
        let carry = values.age_start % ageStep;
        values.age_start -= carry;
        values.age_end = this.ageMaximum;
        this.filterForm.patchValue({
          age_start: values.age_start,
        });
      } else if (values.age_start && values.age_end) {
        let carry_start = values.age_start % ageStep;
        let carry_end = values.age_end % ageStep;
        values.age_start -= carry_start;
        values.age_end += carry_end !== 0 ? ageStep - carry_end : 0;
        this.filterForm.patchValue({
          age_start: values.age_start,
          age_end: values.age_end,
        });
      }
      filters.push({
        name: 'age',
        min: values.age_start,
        max: values.age_end,
      });
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

  resetFilters(): void {
    this.filterForm.reset({ job: '', education: '', state: '' });
  }
}
