import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MapService } from './map.service';
import { environment as env } from 'environments/environment';

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

interface memberInfo {
  birthdate: Date;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService implements OnInit {
  pipe = new DatePipe('en-US');
  defaultNickname = 'genparer';
  private nicknameSubject$ = new BehaviorSubject<string>(this.defaultNickname);
  public nickname$: Observable<string>;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private mapService: MapService
  ) {
    this.nickname$ = this.nicknameSubject$.asObservable();
    this.updateNickname(this.getSessionId());
  }
  ngOnInit(): void {}

  getEmail(): Observable<string> {
    return this.auth.user$.pipe(
      map((user) => (user?.email ? user?.email : 'Error'))
    );
  }

  setSessionId(): Observable<Object | undefined> {
    return this.getEmail()
      .pipe(
        switchMap((mail) =>
          this.http
            .get<sessionIdResponse>(
              env.protocol + env.backendURL + '/members/session',
              { params: { email: mail } }
            )
            .pipe(
              catchError((err) => {
                console.log(err);
                return of(undefined);
              })
            )
            .pipe(
              map((jsonResponse) =>
                jsonResponse ? jsonResponse.sessionId : undefined
              )
            )
        )
      )
      .pipe(
        tap((id) => {
          if (id) {
            sessionStorage.setItem('sessionId', id);
            this.updateNickname(id);
          }
        })
      );
  }

  getSessionId(): string | null {
    const id = sessionStorage.getItem('sessionId');
    return id;
  }

  private updateNickname(sessionId: string | null) {
    if (sessionId) {
      this.http
        .get<memberDataResponse>(env.protocol + env.backendURL + '/members', {
          params: { sessionId },
        })
        .pipe(map((memberData) => memberData.name))
        .pipe(
          catchError((err) => {
            console.error(err);
            return of(this.defaultNickname);
          })
        )
        .subscribe((nickname) => this.nicknameSubject$.next(nickname));
    } else {
      this.nicknameSubject$.next(this.defaultNickname);
    }
  }

  getMemberInfo(): Observable<memberInfo> {
    let sessionId = this.getSessionId();
    if (sessionId) {
      return this.http
        .get<memberDataResponse>(env.protocol + env.backendURL + '/members', {
          params: { sessionId },
        })
        .pipe(
          map((memberData) => ({
            birthdate: memberData.birthdate,
            gender: this.mapService.mapGenderBtoF(memberData.gender),
          }))
        );
    } else {
      return of();
    }
  }

  registerMember(
    name: string,
    birthdate: Date,
    gender: string
  ): Observable<Object> {
    const formatDate = this.pipe.transform(birthdate, 'yyyy-MM-dd');
    gender = this.mapService.mapGenderFtoB(gender);
    return this.getEmail()
      .pipe(
        switchMap((mail) => {
          return this.http.post(env.protocol + env.backendURL + '/members', {
            id: null,
            email: mail,
            name: name,
            birthdate: formatDate,
            gender: gender,
          });
        })
      )
      .pipe(switchMap(() => this.setSessionId()))
      .pipe(
        map((sessionID) =>
          sessionID ? sessionID : { error: 'Could not set SessionID' }
        )
      );
  }

  editNickname(newName: string): Observable<Object> {
    let sessionId = this.getSessionId();
    return this.http
      .patch(env.protocol + env.backendURL + '/members', {
        name: newName,
        sessionId,
      })
      .pipe(tap(() => this.updateNickname(sessionId)));
  }

  invalidateSessionId(): Observable<Object> {
    return this.getEmail()
      .pipe(
        switchMap((mail) =>
          this.http.delete(env.protocol + env.backendURL + '/members/session', {
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
