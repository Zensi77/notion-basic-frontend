import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interfaces';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //Emit auth status to the app
  currentUser = computed(() => this._currentUser());
  authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus();
  }

  login(username: string, password: string): Observable<boolean> {
    const url = environment.user_base_url + '/token';
    // La api espera los datos en formato x-www-form-urlencoded
    const body = `username=${username}&password=${password}`;
    console.log(body);

    return this._http
      .post<LoginResponse>(url, body, {
        // Especificar el tipo de contenido, por defecto angular envía json
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        map(({ token }) => this.setAuthentication(token)),
        catchError((err) => {
          console.log(err);
          return throwError('Credenciales incorrectas');
        })
      );
  }

  private checkAuthStatus(): Observable<boolean> {
    return of(true);
  }

  private setAuthentication(token: string): boolean {
    //this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  logOut() {
    // sessionStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.unauthenticated);
    sessionStorage.removeItem('token');
  }
}
