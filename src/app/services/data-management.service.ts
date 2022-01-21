import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { backendURL } from 'app/app.module';
import { MapService } from './map.service';
import { MemberService } from './member.service';

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

  newProfileData(data: ProfileData) {
    if (this.memberService.sessionID$) {
      return this.memberService.sessionID$.subscribe((id) => {
        // TODO Programm erreicht diese Stelle nicht, wodurch die Salary Daten nicht gespeichert werden. Momentan wissen wir nicht wie der Fehler behoben wird.
        // An dieser Stelle scheitert der Rest der Webapplikation
        return this.http.put(backendURL + '/salary/own', {
          sessionId: id,
          salary: data.salary,
          jobTitle: data.job_title,
          state: this.mapService.mapFederalStateFtoB(data.federal_state),
          levelOfEducation: this.mapService.mapEducationDegreeFtoB(
            data.education_degree
          ),
        });
      });
    } else {
      return EMPTY;
    }
  }

  getProfileData(): Observable<ProfileData> {
    if (this.memberService.sessionID$) {
      return this.memberService.sessionID$.pipe(
        switchMap((id) =>
          this.http
            .get<ResponseData>(backendURL + '/salary/own', {
              params: { sessionId: id },
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
            )
        )
      );
    } else {
      return EMPTY;
    }
  }
}
