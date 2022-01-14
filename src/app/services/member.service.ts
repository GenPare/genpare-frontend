import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { backendURL } from 'app/app.module';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MapService } from './map.service';

interface sessionIdResponse {
  sessionId: sessionIdType;
}
type sessionIdType = string;

interface memberDataResponse {
  email: string;
  name: string;
  birthdate: Date;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService implements OnInit {
  userEmail$: Observable<string>;
  pipe = new DatePipe('en-US');

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private mapService: MapService
  ) {
    this.userEmail$ = this.getEmail();
  }
  ngOnInit(): void {}

  private getEmail(): Observable<string> {
    return this.auth.user$.pipe(
      map((user) => (user?.email ? user?.email : 'Error'))
    );
  }

  setSessionId(): Observable<sessionIdType | undefined> {
    return this.userEmail$.pipe(
      switchMap((mail) =>
        this.http
          .get<sessionIdResponse>(backendURL + '/members/session', {
            params: { email: mail },
          })
          .pipe(map((jsonResponse) => jsonResponse.sessionId))
          .pipe(tap((id) => localStorage.setItem('sessionId', id)))
          .pipe(catchError(() => of(undefined)))
      )
    );
  }

  getSessionId() {
    return localStorage.getItem('sessionId');
  }

  getNickname(): Observable<string> {
    let sessionId = this.getSessionId();
    return sessionId
      ? this.http
          .get<memberDataResponse>(backendURL + '/members', {
            params: { sessionId },
          })
          .pipe(map((jsonResponse) => jsonResponse.name))
          .pipe(catchError(() => of('No Nickname')))
      : of('No Nickname');
  }

  registerMember(name: string, birthdate: Date, gender: string) {
    const formatDate = this.pipe.transform(birthdate, 'yyyy-MM-dd');
    gender = this.mapService.mapGenderFtoB(gender);
    console.log('im register', name, gender, birthdate);
    return this.userEmail$
      .pipe(
        switchMap((mail) =>
          this.http.post(backendURL + '/members', {
            id: null,
            email: mail,
            name: name,
            birthdate: formatDate,
            gender: gender,
          })
        )
      )
      .pipe(tap(() => this.setSessionId()))
      .pipe(delay(1000));
  }

  invalidateSessionId() {
    return this.userEmail$.pipe(
      switchMap((mail) =>
        this.http.delete(backendURL + '/members/session', {
          params: {
            email: mail,
          },
        })
      )
    );
  }
}
