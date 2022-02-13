import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { backendURL } from 'app/app.module';
import { MapService } from './map.service';
import { MemberService } from './member.service';
import { map } from 'rxjs/operators';

export interface JobInfo {
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
export class JobInformationService {
  constructor(
    private http: HttpClient,
    private mapService: MapService,
    private memberService: MemberService
  ) {}

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

  newJobInformation(data: JobInfo): Observable<Object | never> {
    const sessionId = this.memberService.getSessionId();
    if (sessionId) {
      return this.http.put(backendURL + '/salary/own', {
        sessionId: sessionId,
        salary: data.salary,
        jobTitle: data.jobTitle,
        state: this.mapService.mapFederalStateFtoB(data.state),
        levelOfEducation: this.mapService.mapEducationDegreeFtoB(
          data.levelOfEducation
        ),
      });
    } else {
      return EMPTY;
    }
  }

  getJobInformation(): Observable<JobInfo> {
    const sessionId = this.memberService.getSessionId();
    if (sessionId) {
      return this.http
        .get<JobInfo>(backendURL + '/salary/own', {
          params: { sessionId: sessionId },
        })
        .pipe(
          map((backendResponse) => ({
            ...backendResponse,
            levelOfEducation: this.mapService.mapEducationDegreeBtoF(
              backendResponse.levelOfEducation
            ),
            state: this.mapService.mapFederalStateBtoF(backendResponse.state),
          }))
        );
    } else {
      return EMPTY;
    }
  }
}
