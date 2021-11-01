import { Injectable } from '@angular/core';
import { education_degrees_s, federal_states_s, genders_s } from "@shared/model/select_data";
import { education_degrees_b, federal_states_b, genders_b } from "@shared/model/backend_data";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  gendersMap = new Map();
  federalStatesMap = new Map();
  educationDegreesMap = new Map();

  constructor() {
    this.initialize();
  }

  initialize(): void {
    for(let i=0; i<federal_states_s.length; i++){
      this.educationDegreesMap.set(education_degrees_s[i], education_degrees_b[i]);
    }

    for(let i=0; i<federal_states_s.length; i++){
      this.federalStatesMap.set(federal_states_s[i], federal_states_b[i]);
    }

    for(let i=0; i<genders_s.length; i++){
      this.gendersMap.set(genders_s[i], genders_b[i]);
    }
  }

  mapGender(key: string): string {
    return this.gendersMap.get(key);
  }

  mapEducationDegree(key: string): string {
    return this.educationDegreesMap.get(key);
  }

  mapFederalState(key: string): string {
    return this.federalStatesMap.get(key);
  }
}
