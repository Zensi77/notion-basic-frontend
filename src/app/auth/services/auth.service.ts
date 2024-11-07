import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interfaces';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //Emit auth status to the app
  currentUser = computed(() => this._currentUser());
  authStatus = computed(() => this._authStatus());

  constructor() {
    this._currentUser.set({
      id: 'a8b8c8d8-e8f8-11ec-b939-0242ac120002',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    });
    this.checkAuthStatus();
  }

  login(email: string, password: string) {}

  private checkAuthStatus(): Observable<boolean> {
    return of(true);
  }

  logOut() {
    // sessionStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.unauthenticated);
  }
}
