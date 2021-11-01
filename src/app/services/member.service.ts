import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { backendURL } from 'app/app.module';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, EMPTY, of, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

interface sessionIdResponse {
  sessionId: number;
}

interface memberDataResponse {
  email: string;
  name: string;
  birthdate: Date;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService implements OnDestroy {
  userEmail?: string;
  sessionID?: number;
  pipe = new DatePipe('en-US');
  subscriptions = new Subscription();

  constructor(private http: HttpClient, private auth: AuthService) {
    this.getSessionId();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getEmail(): Observable<string> {
    return this.auth.user$
      .pipe(map((user) => (user?.email ? user?.email : '')))
      .pipe(tap((email) => (this.userEmail = email)));
  }

  getNickname(): Observable<string> {
    console.log('getted name');
    return this.sessionID
      ? this.http
          .get<memberDataResponse>(backendURL + '/members', {
            params: { sessionId: this.sessionID },
          })
          .pipe(map((jsonResponse) => jsonResponse.name))
      : EMPTY;
  }

  registerMember(name: string, birthdate: Date, gender: string) {
    const formatDate = this.pipe.transform(birthdate, 'yyyy-MM-dd');
    return this.userEmail
      ? this.http
          .post(backendURL + '/members', {
            id: null,
            email: this.userEmail,
            name: name,
            birthdate: formatDate,
            gender: gender,
          })
          .subscribe(() => this.getSessionId())
      : EMPTY;
  }

  getSessionId(): Observable<number> {
    if (this.userEmail) {
      return this.http
        .get<sessionIdResponse>(backendURL + '/members/session', {
          params: { email: this.userEmail },
        })
        .pipe(map((jsonResponse) => jsonResponse.sessionId))
        .pipe(tap((id) => (this.sessionID = id)));
    } else {
      return this.getEmail().pipe(
        switchMap((email) =>
          this.http
            .get<sessionIdResponse>(backendURL + '/members/session', {
              params: { email: email },
            })
            .pipe(map((jsonResponse) => jsonResponse.sessionId))
            .pipe(tap((id) => (this.sessionID = id)))
        )
      );
    }
  }

  invalidateSessionId() {
    if (this.userEmail) {
      return this.http.delete(backendURL + '/members/session', {
        params: {
          email: this.userEmail,
        },
      });
    } else {
      return EMPTY;
    }
  }
}
