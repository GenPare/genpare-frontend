import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { backendURL } from 'app/app.module';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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
  private _cachedSessionID?: Subject<sessionIdType>;
  sessionID$?: Observable<sessionIdType>;
  userEmail$: Observable<string>;
  pipe = new DatePipe('en-US');

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private mapService: MapService
  ) {
    this.userEmail$ = this.getEmail();
    if (!this._cachedSessionID) {
      this._cachedSessionID = new Subject<sessionIdType>();
      this.getSessionId().subscribe((id) => {
        if (id) {
          this._cachedSessionID?.next(id);
          this.sessionID$ = this._cachedSessionID?.asObservable();
        } else {
          this.sessionID$ = undefined;
        }
      });
    }
  }
  ngOnInit(): void {}

  private getEmail(): Observable<string> {
    return this.auth.user$.pipe(
      map((user) => (user?.email ? user?.email : 'Error'))
    );
  }

  private getSessionId(): Observable<sessionIdType | undefined> {
    return this.userEmail$.pipe(
      switchMap((mail) =>
        this.http
          .get<sessionIdResponse>(backendURL + '/members/session', {
            params: { email: mail },
          })
          .pipe(map((jsonResponse) => jsonResponse.sessionId))
          .pipe(catchError(() => of(undefined)))
      )
    );
  }

  getNickname(): Observable<string> {
    return this.sessionID$
      ? this.sessionID$.pipe(
          switchMap((id) =>
            this.http
              .get<memberDataResponse>(backendURL + '/members', {
                params: { sessionId: id },
              })
              .pipe(map((jsonResponse) => jsonResponse.name))
              .pipe(catchError(() => of('No Nickname')))
          )
        )
      : of('No Nickname');
  }

  registerMember(name: string, birthdate: Date, gender: string) {
    const formatDate = this.pipe.transform(birthdate, 'yyyy-MM-dd');
    gender = this.mapService.mapGenderFtoB(gender);
    console.log('im register', name, gender, birthdate);
    this.userEmail$.subscribe((mail) =>
      this.http
        .post(backendURL + '/members', {
          id: null,
          email: mail,
          name: name,
          birthdate: formatDate,
          gender: gender,
        })
        .subscribe()
    );
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
