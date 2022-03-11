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
  readonly ageMaximum = 99;
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
        if (this.filterForm.errors.minSmallerMax.minControl == "age_start") {
          this.filterForm.controls.age_start.setErrors({minSmallerMax: "true"})
          this.filterForm.controls.age_end.setErrors({minSmallerMax: "true"})
        } else {
          this.filterForm.controls.salary_start.setErrors({minSmallerMax: "true"})
          this.filterForm.controls.salary_end.setErrors({minSmallerMax: "true"})
        }
      } else {
        this.filterForm.controls.age_start.setErrors(null)
        this.filterForm.controls.age_end.setErrors(null)
        this.filterForm.controls.salary_start.setErrors(null)
        this.filterForm.controls.salary_end.setErrors(null)
        this.filterForm.updateValueAndValidity({emitEvent: false})
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
    let filters: any[] = [];

    let age_start = this.filterForm.value.age_start;
    let age_end = this.filterForm.value.age_end;
    let salary_start = this.filterForm.value.salary_start;
    let salary_end = this.filterForm.value.salary_end;
    let job =
      this.filterForm.value.job &&
      this.filterForm.value.job !== this.noSelectionText;
    let state =
      this.filterForm.value.state &&
      this.filterForm.value.state !== this.noSelectionText;
    let education =
      this.filterForm.value.education &&
      this.filterForm.value.education !== this.noSelectionText;

    if (salary_start || salary_end) {
      if (salary_end && !salary_start) {
        let carry = this.filterForm.value.salary_end % 500;
        this.filterForm.patchValue({
          salary_end: this.filterForm.value.salary_end - carry,
        });
        this.filterForm.patchValue({ salary_start: this.salaryMinimum });
      } else if (salary_start && !salary_end) {
        let carry = this.filterForm.value.salary_start % 500;
        this.filterForm.patchValue({
          salary_start: this.filterForm.value.salary_start - carry,
        });
        this.filterForm.patchValue({ salary_end: this.salaryMaximum });
      } else if (salary_end && salary_start) {
        let carry_start = this.filterForm.value.salary_start % 500;
        this.filterForm.patchValue({
          salary_start: this.filterForm.value.salary_start - carry_start,
        });
        let carry_end = this.filterForm.value.salary_end % 500;
        this.filterForm.patchValue({
          salary_end: this.filterForm.value.salary_end - carry_end,
        });
      }
      filters.push({
        name: 'salary',
        min: this.filterForm.value.salary_start,
        max: this.filterForm.value.salary_end,
      });
    }

    if (age_start || age_end) {
      if (age_end && !age_start) {
        let carry = this.filterForm.value.age_end % 5;
        this.filterForm.patchValue({
          age_end: this.filterForm.value.age_end - carry,
        });
        this.filterForm.patchValue({ age_start: this.ageMinimum });
      } else if (age_start && !age_end) {
        let carry = this.filterForm.value.age_start % 5;
        this.filterForm.patchValue({
          age_start: this.filterForm.value.age_start - carry,
        });
        this.filterForm.patchValue({ age_end: this.ageMaximum });
      } else if (age_start && age_end) {
        let carry_start = this.filterForm.value.age_start % 5;
        this.filterForm.patchValue({
          age_start: this.filterForm.value.age_start - carry_start,
        });
        let carry_end = this.filterForm.value.age_end % 5;
        this.filterForm.patchValue({
          age_end: this.filterForm.value.age_end - carry_end,
        });
      }
      filters.push({
        name: 'age',
        min: this.filterForm.value.age_start,
        max: this.filterForm.value.age_end,
      });
    }

    if (job) {
      filters.push({
        name: 'jobTitle',
        desiredJobTitle: this.filterForm.value.job,
      });
    }

    if (state) {
      filters.push({
        name: 'state',
        desiredState: this.mapService.mapFederalStateFtoB(
          this.filterForm.value.state
        ),
      });
    }

    if (education) {
      filters.push({
        name: 'levelOfEducation',
        desiredLevelOfEducation: this.mapService.mapEducationDegreeFtoB(
          this.filterForm.value.education
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
