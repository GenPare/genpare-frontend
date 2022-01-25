import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { backendURL } from 'app/app.module';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MapService } from './map.service';
import { Router } from '@angular/router';

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
  pipe = new DatePipe('en-US');

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private mapService: MapService,
    private router: Router
  ) {}
  ngOnInit(): void {}

  getEmail(): Observable<string> {
    return this.auth.user$.pipe(
      map((user) => (user?.email ? user?.email : 'Error'))
    );
  }

  setSessionId(): Observable<Object> {
    return this.getEmail()
      .pipe(
        switchMap((mail) =>
          this.http
            .get<sessionIdResponse>(backendURL + '/members/session', {
              params: { email: mail },
            })
            .pipe(map((jsonResponse) => jsonResponse.sessionId))
        )
      )
      .pipe(
        tap((id) => {
          console.log('setting ID');
          sessionStorage.setItem('sessionId', id);
        })
      );
  }

  getSessionId(): string | null {
    return sessionStorage.getItem('sessionId');
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
    return this.getEmail().pipe(
      switchMap((mail) => {
        return this.http.post(backendURL + '/members', {
          id: null,
          email: mail,
          name: name,
          birthdate: formatDate,
          gender: gender,
        });
      })
    );
  }

  invalidateSessionId(): Observable<Object> {
    return this.getEmail()
      .pipe(
        switchMap((mail) =>
          this.http.delete(backendURL + '/members/session', {
            params: {
              email: mail,
            },
          })
        )
      )
      .pipe(
        tap(() => {
          sessionStorage.clear();
        })
      );
  }
}
