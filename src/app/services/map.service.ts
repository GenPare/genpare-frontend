import { Injectable } from '@angular/core';
import {
  education_degrees_f,
  federal_states_f,
  genders_f,
} from '@shared/model/frontend_data';
import {
  education_degrees_b,
  federal_states_b,
  genders_b,
} from '@shared/model/backend_data';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private gendersMapFtoB = new Map();
  private federalStatesMapFtoB = new Map();
  private educationDegreesMapFtoB = new Map();

  private gendersMapBtoF = new Map();
  private federalStatesMapBtoF = new Map();
  private educationDegreesMapBtoF = new Map();

  constructor() {
    this.initialize();
  }

  initialize(): void {
    for (let i = 0; i < federal_states_f.length; i++) {
      this.educationDegreesMapFtoB.set(
        education_degrees_f[i],
        education_degrees_b[i]
      );
    }

    for (let i = 0; i < federal_states_f.length; i++) {
      this.federalStatesMapFtoB.set(federal_states_f[i], federal_states_b[i]);
    }

    for (let i = 0; i < genders_f.length; i++) {
      this.gendersMapFtoB.set(genders_f[i], genders_b[i]);
    }

    for (let i = 0; i < federal_states_f.length; i++) {
      this.educationDegreesMapBtoF.set(
        education_degrees_b[i],
        education_degrees_f[i]
      );
    }

    for (let i = 0; i < federal_states_f.length; i++) {
      this.federalStatesMapBtoF.set(federal_states_b[i], federal_states_f[i]);
    }

    for (let i = 0; i < genders_f.length; i++) {
      this.gendersMapBtoF.set(genders_b[i], genders_f[i]);
    }
  }

  mapGenderFtoB(key: string): string {
    return this.gendersMapFtoB.get(key);
  }

  mapEducationDegreeFtoB(key: string): string {
    return this.educationDegreesMapFtoB.get(key);
  }

  mapFederalStateFtoB(key: string): string {
    return this.federalStatesMapFtoB.get(key);
  }

  mapGenderBtoF(key: string): string {
    return this.gendersMapBtoF.get(key);
  }

  mapEducationDegreeBtoF(key: string): string {
    return this.educationDegreesMapBtoF.get(key);
  }

  mapFederalStateBtoF(key: string): string {
    return this.federalStatesMapBtoF.get(key);
  }
}
