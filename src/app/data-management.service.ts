import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { backendURL } from 'app/app.module';
import { MapService } from './map.service';

export interface ProfileData {
  job_title: string;
  salary: number;
  education_degree: string;
  federal_state: string;
}

interface ResponseData {
  salary: number;
  jobTitle: string;
  state: string;
  levelOfEducation: string;
}

export interface CompareData {
  job_title: string;
  salary: Range;
  age: Range;
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

  constructor(private http: HttpClient, private mapService: MapService) {}

  getCompareData(): Observable<CompareData[]> {
    return of([
      {
        job_title: 'Polizist',
        salary: {
          min: 4000,
          max: 4500,
        },
        age: {
          min: 45,
          max: 49,
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
        age: {
          min: 45,
          max: 49,
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
        age: {
          min: 45,
          max: 49,
        },
        education_degree: 'Master',
        federal_state: 'Hessen',
        gender: 'divers',
      },
    ]);
  }

  newProfileData(data: ProfileData) {
    if (this.sessionId) {
      return this.http
        .put(backendURL + '/salary/own', {
          sessionId: this.sessionId,
          salary: data.salary,
          jobTitle: data.job_title,
          state: this.mapService.mapFederalState(data.federal_state),
          levelOfEducation: this.mapService.mapEducationDegree(
            data.education_degree
          ),
        })
        .subscribe();
    } else {
      return this.getSessionId()
        .pipe(
          switchMap((sessionId) => {
            return this.http.put(backendURL + '/salary/own', {
              sessionId: sessionId,
              salary: data.salary,
              jobTitle: data.job_title,
              state: this.mapService.mapFederalState(data.federal_state),
              levelOfEducation: this.mapService.mapEducationDegree(
                data.education_degree
              ),
            });
          })
        )
        .subscribe();
    }
  }

  getProfileData(): Observable<ProfileData> {
    if (this.sessionId) {
      return this.http
        .get<ResponseData>(backendURL + '/salary/?sessionId=' + this.sessionId)
        .pipe(
          map((data) => ({
            job_title: data.jobTitle,
            salary: data.salary,
            education_degree: data.levelOfEducation,
            federal_state: data.state,
          }))
        );
    } else {
      return this.getSessionId().pipe(
        switchMap((sessionId) => {
          return this.http
            .get<ResponseData>(backendURL + '/salary/?sessionId=' + sessionId)
            .pipe(
              map((data) => ({
                job_title: data.jobTitle,
                salary: data.salary,
                education_degree: data.levelOfEducation,
                federal_state: data.state,
              }))
            );
        })
      );
    }
  }

  getSessionId(): Observable<number> {
    return of(this.mock_session_id);
  }
}
