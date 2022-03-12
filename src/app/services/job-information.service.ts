import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MapService } from './map.service';
import { MemberService } from './member.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment as env } from 'environments/environment';

export interface JobInfo {
  salary: number;
  jobTitle: string;
  state: string;
  levelOfEducation: string;
}

export interface CompRequestData {
  filters: any[];
  resultTransformers: any[];
}

export interface CompResponseData {
  results: { results: CompareData[] }[];
}

export interface CompareData {
  jobTitle: string;
  salary: Range;
  age: Range;
  levelOfEducation: string;
  state: string;
  gender: string;
}

export interface Range {
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

  getCompareData(req: CompRequestData): Observable<CompareData[]> {
    return this.http
      .post<CompResponseData>(env.protocol + env.backendURL + '/salary', req)
      .pipe(map((res) => res.results[0].results))
      .pipe(
        map((arr) =>
          arr.map((element) => ({
            age: element.age,
            salary: element.salary,
            jobTitle: element.jobTitle,
            gender: this.mapService.mapGenderBtoF(element.gender),
            state: this.mapService.mapFederalStateBtoF(element.state),
            levelOfEducation: this.mapService.mapEducationDegreeBtoF(
              element.levelOfEducation
            ),
          }))
        )
      );
  }

  newJobInformation(data: JobInfo): Observable<Object | never> {
    const sessionId = this.memberService.getSessionId();
    if (sessionId) {
      return this.http.put(env.protocol + env.backendURL + '/salary/own', {
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
        .get<JobInfo>(env.protocol + env.backendURL + '/salary/own', {
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

  modifyJobInformation(data: JobInfo): Observable<Object | never> {
    const sessionId = this.memberService.getSessionId();
    if (sessionId) {
      return this.http.patch(env.protocol + env.backendURL + '/salary/own', {
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

  getJobTitles(): Observable<string[]> {
    return this.http.get<string[]>(env.protocol + env.backendURL + '/salary/info');
  }
}
