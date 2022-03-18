import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requireOneControl(): ValidatorFn {
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

interface LooseObject {
  [key: string]: any;
}

function flattenObject(obj: any): Object {
  let flattened: LooseObject = {};

  Object.keys(obj).forEach((key) => {
    let value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value));
    } else {
      flattened[key] = value;
    }
  });

  return flattened;
}
