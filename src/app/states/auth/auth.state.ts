import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthStateModel } from './auth.model';
import {
  CheckSession,
  CheckSessionFailure,
  LoginSuccess,
  Logout,
  SetSyncToken,
  UpdateUser,
  UpdateUserData,
} from './auth.actions';
import { catchError, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database/database.service';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    token: null,
    sync_token: null,
  },
})
@Injectable()
export class AuthState {
  constructor(
    private readonly _authService: AuthService,
    private readonly _databaseService: DatabaseService
  ) {}

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return !!state.token;
  }

  @Selector()
  static getUser(state: AuthStateModel) {
    return state.user;
  }

  @Action(LoginSuccess)
  async loginSuccess(
    { patchState, getState }: StateContext<AuthStateModel>,
    action: LoginSuccess
  ) {
    localStorage.setItem('user', JSON.stringify(action.payload.user));
    localStorage.setItem('token', action.payload.token);

    patchState({
      user: action.payload.user,
      token: action.payload.token,
    });
  }

  @Action(Logout)
  async logout({ patchState }: StateContext<AuthStateModel>) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('sync_token');

    patchState({
      user: null,
      token: null,
      sync_token: null,
    });
  }

  @Action(CheckSession)
  checkSession({ dispatch, getState, setState }: StateContext<AuthStateModel>) {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const state = getState();

    setState({
      ...state,
      token: token,
    });

    return this._authService.checkCurrentUser().pipe(
      tap((response: any) => dispatch(new UpdateUser(response.data))),
      catchError((error: any) => dispatch(new CheckSessionFailure(error.error)))
    );
  }

  @Action(UpdateUser)
  updateUser(
    { getState, setState }: StateContext<AuthStateModel>,
    { payload }: UpdateUser
  ) {
    const state = getState();

    localStorage.setItem('user', JSON.stringify(payload));

    setState({
      ...state,
      user: payload,
    });
  }

  @Action(SetSyncToken)
  setSyncToken(
    { getState, setState }: StateContext<AuthStateModel>,
    { payload }: SetSyncToken
  ) {
    const state = getState();

    localStorage.setItem('sync_token', payload);

    setState({
      ...state,
      sync_token: payload,
    });
  }

  @Action(UpdateUserData)
  updateUserData(
    { getState, setState }: StateContext<AuthStateModel>,
    { payload }: UpdateUserData
  ) {
    const state = getState();

    localStorage.setItem('user', JSON.stringify(payload));

    setState({
      ...state,
      user: payload,
    });
  }
}
