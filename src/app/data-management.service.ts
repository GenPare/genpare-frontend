import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { backendURL } from 'app/app.module';

export interface ProfileData {
  job_title: string;
  salary: number;
  education_degree: string;
  federal_state: string;
  gender: string;
}

export interface CompareData {
  job_title: string;
  salary: Range;
  education_degree: string;
  federal_state: string;
  gender: string;
}

interface Range {
  min: number;
  max: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataManagementService {
  mock_session_id: number = 69;

  sessionId?: number;

  constructor(private http: HttpClient) {}

  getCompareData(): Observable<CompareData[]> {
    return of([
      {
        job_title: 'Polizist',
        salary: {
          min: 4000,
          max: 4500,
        },
        education_degree: 'Ausbildung',
        federal_state: 'Brandenburg',
        gender: 'weiblich',
      },
      {
        job_title: 'Krankenpfleger',
        salary: {
          min: 2500,
          max: 3000,
        },
        education_degree: 'Abitur',
        federal_state: 'Berlin',
        gender: 'männlich',
      },
      {
        job_title: 'Anwalt',
        salary: {
          min: 5500,
          max: 6000,
        },
        education_degree: 'Master',
        federal_state: 'Hessen',
        gender: 'divers',
      },
    ]);
  }

  newProfileData(data: ProfileData) {
    if (this.sessionId) {
      return this.http.put(backendURL + '/salary/own', {
        sessionId: this.sessionId,
        salary: data.salary,
        jobTitle: data.job_title,
        state: data.federal_state,
        levelOfEducation: data.education_degree,
      });
    } else {
      console.log("string");
      return this.getSessionId().pipe(
        switchMap((sessionId) => {
          console.log(data.education_degree, data.federal_state);
          return this.http.put(backendURL + '/salary/own', {
            sessionId: sessionId,
            salary: data.salary,
            jobTitle: data.job_title,
            state: data.federal_state,
            levelOfEducation: data.education_degree,
          });
        })
      ).subscribe();
    }
  }

  getSessionId(): Observable<number> {
    return of(this.mock_session_id);
  }
}
