import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  CheckSession,
  LoginSuccess,
  Logout,
  SetSyncToken,
  UpdateUserData,
} from '../states/auth/auth.actions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthState } from '../states/auth/auth.state';
import { UserModel } from '../core/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _store: Store = inject(Store);
  private _httpClient: HttpClient = inject(HttpClient);
  private _api: string = environment.api;

  constructor() {}

  get isAuthenticated() {
    const isAuthenticated = this._store.selectSnapshot(
      AuthState.isAuthenticated
    );
    return isAuthenticated;
  }

  login(email: string, password: string) {
    const url = `${this._api}api/auth/login`;
    return this._httpClient.post(url, {
      email,
      password,
    });
  }

  logout() {
    return this._store.dispatch(new Logout());
  }

  loginSuccess(data: any) {
    return this._store.dispatch(new LoginSuccess(data));
  }

  checkSession() {
    return this._store.dispatch(new CheckSession());
  }

  setSyncToken(access_token: string) {
    return this._store.dispatch(new SetSyncToken(access_token));
  }

  updateUserData(user: UserModel) {
    return this._store.dispatch(new UpdateUserData(user));
  }

  checkCurrentUser() {
    const token = localStorage.getItem('token');
    const url = `${this._api}api/user/profile`;

    return this._httpClient.get(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }
}
