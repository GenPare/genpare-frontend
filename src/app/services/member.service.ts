import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { backendURL } from 'app/app.module';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { DatePipe } from '@angular/common';

interface sessionIdResponse {
  sessionId: number;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  userEmail?: string;
  sessionID?: number;
  pipe = new DatePipe('')

  constructor(private http: HttpClient, private auth: AuthService) {}

  registerMember(name: string, birthdate: Date) {
    birthdate
    //maybe Date Formatting
    if (this.userEmail) {
      return this.http.post(backendURL + '/members', {
        id: null,
        email: this.userEmail,
        name: name,
        birthdate: birthdate,
      });
    } else {
      return this.getEmail().pipe(
        switchMap((email) =>
          this.http.post(backendURL + '/members', {
            id: null,
            email: email,
            name: name,
            birthdate: birthdate,
          })
        )
      );
    }
  }

  deleteMember() {
    if (this.userEmail && this.sessionID) {
      return this.http.post(backendURL + '/members', {
        params: { email: this.userEmail, sessionId: this.sessionID },
      });
    } else {
      return this.getSessionID().pipe(
        switchMap((id) =>
          this.userEmail
            ? this.http.post(backendURL + '/members', {
                params: { email: this.userEmail, sessionId: id },
              })
            : EMPTY
        )
      );
    }
  }

  changeName(newName: string) {
    return this.sessionID
      ? this.http.patch(backendURL + '/members', {
          name: newName,
          sessionId: this.sessionID,
        })
      : this.getSessionID().pipe(
          switchMap((id) =>
            this.http.patch(backendURL + '/members', {
              name: newName,
              sessionId: id,
            })
          )
        );
  }

  getSessionID(): Observable<number> {
    if (this.userEmail) {
      return this.http
        .post<sessionIdResponse>(backendURL + '/members/session', {
          params: { email: this.userEmail },
        })
        .pipe(map((json) => json.sessionId))
        .pipe(tap((id) => (this.sessionID = id)));
    } else {
      return this.getEmail()
        .pipe(
          switchMap((email) =>
            email
              ? this.http.post<sessionIdResponse>(
                  backendURL + '/members/session',
                  {
                    params: { email: email },
                  }
                )
              : EMPTY
          )
        )
        .pipe(map((json) => json.sessionId))
        .pipe(tap((id) => (this.sessionID = id)));
    }
  }

  getEmail(): Observable<string | undefined> {
    return this.auth.user$
      .pipe(map((user) => user?.email))
      .pipe(tap((email) => (this.userEmail = email)));
  }

  sessionIDInvalidation() {
    return this.userEmail
      ? this.http.delete(backendURL + '/members/session', {
          params: { email: this.userEmail },
        })
      : this.getEmail().pipe(
          switchMap((mail) =>
            mail
              ? this.http.delete(backendURL + '/members/session', {
                  params: { email: mail },
                })
              : EMPTY
          )
        );
  }
}
