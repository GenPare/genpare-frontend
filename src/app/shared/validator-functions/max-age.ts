import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxAge(years: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueDate = new Date(control.value).getTime();
    const actualAge =
      new Date(new Date().getTime() - valueDate).getFullYear() - 1970;
    return actualAge > years
      ? {
          maxAge: {
            maximumAge: years,
            actualAge,
          },
        }
      : null;
  };
}
