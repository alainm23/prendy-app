import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserModel } from '../core/interfaces/user.model';
import { AuthInterface } from '../core/interfaces/auth.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _httpClient: HttpClient = inject(HttpClient);
  private _apiService: ApiService = inject(ApiService);

  private _api: string = environment.api;

  private defaultUser: UserModel = {
    email: '',
    userId: '',
  };

  private defaultAuthState: AuthInterface = {
    token: '',
    sync_token: '',
  };

  private _authState: BehaviorSubject<AuthInterface> =
    new BehaviorSubject<AuthInterface>(this.defaultAuthState);

  private _user: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(
    this.defaultUser
  );

  constructor() {}

  setUser(value: UserModel) {
    this._user.next(value);
  }

  get user(): Observable<UserModel> {
    return this._user.asObservable();
  }

  get isAuthenticated() {
    return !!this._authState.getValue().token;
  }

  get authState() {
    return this._authState.asObservable();
  }

  login(email: string, password: string) {
    const url = `${this._api}api/auth/login`;
    return this._httpClient.post(url, {
      email,
      password,
    });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('sync_token');

    this._authState.next(this.defaultAuthState);
    this._user.next(this.defaultUser);
  }

  checkSession() {
    const token = localStorage.getItem('token');
    const sync_token = localStorage.getItem('sync_token');
    const user = localStorage.getItem('user');

    if (!token) {
      return;
    }

    if (!sync_token) {
      return;
    }

    if (!user) {
      return;
    }

    this._authState.next({
      token: token,
      sync_token: sync_token,
    });

    this.setUser(JSON.parse(user));

    this.checkCurrentUser().subscribe({
      next: (user: UserModel) => {
        this.setUser(user);
      },
    });
  }

  setAuthData(token: string, sync_token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('sync_token', sync_token);

    this._authState.next({
      token: token,
      sync_token: sync_token,
    });
  }

  setSyncToken(sync_token: string) {
    localStorage.setItem('sync_token', sync_token);

    this._authState.next({
      ...this._authState.getValue(),
      sync_token: sync_token,
    });
  }

  updateUserData(user: UserModel) {
    localStorage.setItem('user', JSON.stringify(user));
    this.setUser(user);
  }

  checkCurrentUser() {
    return this._apiService.get(`${this._api}api/user/profile`);
  }
}
