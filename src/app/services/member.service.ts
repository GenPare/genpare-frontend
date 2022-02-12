import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { backendURL } from 'app/app.module';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
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
  pipe = new DatePipe('en-US');
  defaultNickname = 'genparer';
  public nicknameSubject$ = new Subject<string>();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private mapService: MapService
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
          sessionStorage.setItem('sessionId', id);
          this.getNickname(id);
        })
      );
  }

  getSessionId(): string | null {
    const id = sessionStorage.getItem('sessionId');
    return id;
  }

  private getNickname(sessionId: string): void {
    if (sessionId) {
      this.http
        .get<memberDataResponse>(backendURL + '/members', {
          params: { sessionId },
        })
        .pipe(map((jsonResponse) => jsonResponse.name))
        .pipe(catchError(() => this.defaultNickname))
        .subscribe((nickname) => {
          this.nicknameSubject$.next(nickname);
        });
    } else {
      //TODO Errorhandling
      this.nicknameSubject$.next(this.defaultNickname);
    }
  }

  registerMember(name: string, birthdate: Date, gender: string): Observable<Object> {
    const formatDate = this.pipe.transform(birthdate, 'yyyy-MM-dd');
    gender = this.mapService.mapGenderFtoB(gender);
    return this.getEmail()
      .pipe(
        switchMap((mail) => {
          return this.http.post(backendURL + '/members', {
            id: null,
            email: mail,
            name: name,
            birthdate: formatDate,
            gender: gender,
          });
        })
      )
      .pipe(switchMap(() => this.setSessionId()));
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
