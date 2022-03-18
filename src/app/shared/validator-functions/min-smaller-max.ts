import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minSmallerMax(
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
