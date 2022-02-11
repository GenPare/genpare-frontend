import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'environments/environment.dev';
import { MapService } from './services/map.service';
import { MemberService } from './services/member.service';

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
  sessionId: string | null;

  constructor(
    private http: HttpClient,
    private mapService: MapService,
    private memberService: MemberService
  ) {
    this.sessionId = this.memberService.getSessionId();
  }

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
      return this.http.put(env.backendURL + '/salary/own', {
        sessionId: this.sessionId,
        salary: data.salary,
        jobTitle: data.job_title,
        state: this.mapService.mapFederalStateFtoB(data.federal_state),
        levelOfEducation: this.mapService.mapEducationDegreeFtoB(
          data.education_degree
        ),
      });
    } else {
      return EMPTY;
    }
  }

  getProfileData(): Observable<ProfileData> {
    if (this.sessionId) {
      return this.http
        .get<ResponseData>(env.backendURL + '/salary/own', {
          params: { sessionId: this.sessionId },
        })
        .pipe(
          map((data) => ({
            job_title: data.jobTitle,
            salary: data.salary,
            education_degree: this.mapService.mapEducationDegreeBtoF(
              data.levelOfEducation
            ),
            federal_state: this.mapService.mapFederalStateBtoF(data.state),
          }))
        );
    } else {
      return EMPTY;
    }
  }
}
