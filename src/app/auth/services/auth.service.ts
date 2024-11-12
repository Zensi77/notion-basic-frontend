import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interfaces';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoginResponse } from '../interfaces/login-response';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  currentUser = computed(() => this._currentUser());
  authStatus = computed(() => this._authStatus());

  changeAuthStatusEffect = effect(() => {
    console.log('Auth Status Changed:', this.authStatus());
  });

  login(username: string, password: string): Observable<boolean> {
    const url = environment.user_base_url + '/token';
    const body = `username=${username}&password=${password}`;

    return this._http
      .post<LoginResponse>(url, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        map(({ access_token }) => this.setAuthentication(access_token)),
        catchError((err) => {
          if (err.status === 401) {
            Swal.fire('Error', 'Token inválido', 'error');
          } else if (err.status === 500) {
            Swal.fire('Error', 'Error en el servidor', 'error');
          }

          return throwError(() => new Error('Invalid credentials'));
        })
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${environment.user_base_url}/check-token`;
    const token = localStorage.getItem('token');
    //? https://stackoverflow.com/questions/77534244/local-storage-is-not-defined-in-angular-17

    if (!token) {
      this._authStatus.set(AuthStatus.unauthenticated);
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._http.post<LoginResponse>(url, {}, { headers }).pipe(
      map((res) => {
        this.setAuthentication(token);
        this._authStatus.set(AuthStatus.authenticated);
        return true;
      }),
      catchError((err) => {
        if (err.status === 401) {
          Swal.fire('Error', 'Token inválido', 'error');
        } else if (err.status === 500) {
          Swal.fire('Error', 'Error en el servidor', 'error');
        }
        this._authStatus.set(AuthStatus.unauthenticated);
        return of(false);
      })
    );
  }

  private setAuthentication(token: string): boolean {
    const { sub, email, id } = jwtDecode<any>(token);

    this._currentUser.set({ id, email, name: sub });
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  logOut() {
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.unauthenticated);
    localStorage.removeItem('token');
  }
}
