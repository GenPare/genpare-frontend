import { Injectable } from '@angular/core';
import { genders, federal_states, education_degrees } from "@shared/select_data";
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectDataService {

  constructor() { }

  getGenders(): Observable<String[]> {
    return of(genders);
  }

  getFederalStates(): Observable<String[]> {
    return of(federal_states);
  }

  getEducationDegrees(): Observable<String[]> {
    return of(education_degrees);
  }
}
