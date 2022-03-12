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
import * as _ from 'lodash';

interface LooseObject {
  [key: string]: any
}

function flattenObject(obj:any): Object {
  let flattened:LooseObject = {}

  Object.keys(obj).forEach((key) => {
    let value = obj[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value))
    } else {
      flattened[key] = value;
    }
  })

  return flattened
}

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
            minimumValue: minControl.value,
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
    const flattened = flattenObject(formGroup.value);
    for (const [key, value] of Object.entries(flattened)) {
      if (typeof value === 'object') {
      }
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
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.federal_states = federal_states_f;
    this.education_degrees = education_degrees_f;
    this.jobTitles$ = this.jobInformationService.getJobTitles();
    this.responseData$ = of([]);
    this.responseData = [];
    this.initialState = true;
    this.formChangeSubscribtion = this.filterForm.valueChanges.subscribe(
      (values) => {
        this.setControlErrorMinMax();
      }
    );
  }

  ngOnDestroy(): void {
    this.formChangeSubscribtion.unsubscribe();
  }

  setControlErrorMinMax() {
    if (this.ageControls?.errors?.minSmallerMax) {
      this.ageControls.get('age_start')?.setErrors({
        ...this.ageControls?.get('age_start')?.errors,
        minSmallerMax: true,
      });
      this.ageControls.get('age_end')?.setErrors({
        ...this.ageControls?.get('age_end')?.errors,
        minSmallerMax: true,
      });
    } else if (this.salaryControls?.errors?.minSmallerMax) {
      this.salaryControls.get('salary_start')?.setErrors({
        ...this.salaryControls?.get('salary_start')?.errors,
        minSmallerMax: true,
      });
      this.salaryControls.get('salary_end')?.setErrors({
        ...this.salaryControls?.get('salary_end')?.errors,
        minSmallerMax: true,
      });
    } else {
      if (
        this.ageControls?.get('age_start')?.hasError('minSmallerMax') ||
        this.ageControls?.get('age_end')?.hasError('minSmallerMax')
      ) {
        delete this.ageControls?.get('age_start')?.errors?.minSmallerMax;
        delete this.ageControls?.get('age_end')?.errors?.minSmallerMax;
        this.ageControls
          ?.get('age_start')
          ?.updateValueAndValidity({ emitEvent: false});
        this.ageControls
          ?.get('age_end')
          ?.updateValueAndValidity({ emitEvent: false});
      } else if (
        this.salaryControls?.get('salary_start')?.hasError('minSmallerMax') ||
        this.salaryControls?.get('salary_end')?.hasError('minSmallerMax')
      ) {
        delete this.salaryControls?.get('salary_start')?.errors?.minSmallerMax;
        delete this.salaryControls?.get('salary_end')?.errors?.minSmallerMax;
        this.salaryControls
          ?.get('salary_start')
          ?.updateValueAndValidity({ emitEvent: false});
        this.salaryControls
          ?.get('salary_end')
          ?.updateValueAndValidity({ emitEvent: false});
      }
    }
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
    if (values.salary.salary_start || values.salary.salary_end) {
      if (values.salary.salary_end && !values.salary.salary_start) {
        let carry = values.salary.salary_end % salaryStep;
        values.salary.salary_end += carry !== 0 ? salaryStep - carry : 0;
        values.salary.salary_start = this.salaryMinimum;
        this.salaryControls?.patchValue({ salary_end: values.salary.salary_end });
      } else if (values.salary.salary_start && !values.salary.salary_end) {
        let carry = values.salary.salary_start % salaryStep;
        values.salary.salary_start -= carry;
        values.salary.salary_end = this.salaryMaximum;
        this.salaryControls?.patchValue({
          salary_start: values.salary.salary_start,
        });
      } else if (values.salary.salary_end && values.salary.salary_start) {
        let carry_start = values.salary.salary_start % salaryStep;
        let carry_end = values.salary.salary_end % salaryStep;
        values.salary.salary_start -= carry_start;
        values.salary.salary_end +=
          carry_end !== 0 ? salaryStep - carry_end : 0;
        this.salaryControls?.patchValue({
          salary_end: values.salary.salary_end,
          salary_start: values.salary.salary_start,
        });
      }
      filters.push({
        name: 'salary',
        min: values.salary.salary_start,
        max: values.salary.salary_end,
      });
    }
    const ageStep = 5;
    if (values.age.age_start || values.age.age_end) {
      if (values.age.age_end && !values.age.age_start) {
        let carry = values.age.age_end % ageStep;
        values.age.age_end += carry !== 0 ? ageStep - carry : 0;
        values.age.age_start = this.ageMinimum;
        this.ageControls?.patchValue({
          age_end: values.age.age_end,
        });
      } else if (values.age.age_start && !values.age.age_end) {
        let carry = values.age.age_start % ageStep;
        values.age.age_start -= carry;
        values.age.age_end = this.ageMaximum;
        this.ageControls?.patchValue({
          age_start: values.age.age_start,
        });
      } else if (values.age.age_start && values.age.age_end) {
        let carry_start = values.age.age_start % ageStep;
        let carry_end = values.age.age_end % ageStep;
        values.age.age_start -= carry_start;
        values.age.age_end += carry_end !== 0 ? ageStep - carry_end : 0;
        this.ageControls?.patchValue({
          age_start: values.age.age_start,
          age_end: values.age.age_end,
        });
      }
      filters.push({
        name: 'age',
        min: values.age.age_start,
        max: values.age.age_end,
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
