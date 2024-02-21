import { UserModel } from 'src/app/core/interfaces/user.model';

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public payload: { token: string; user: UserModel }) {}
}

export class CheckSession {
  static readonly type = '[Auth] Check Session';
  constructor() {}
}

export class CheckSessionSuccess {
  static readonly type = '[Auth] Check Session Success';
  constructor() {}
}

export class CheckSessionFailure {
  static readonly type = '[Auth] Check Session Failure';
  constructor(public payload: any) {}
}

export class UpdateUser {
  static readonly type = '[Auth] Update User';
  constructor(public payload: UserModel) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class SetSyncToken {
  static readonly type = '[Auth] Set Sync Token';
  constructor(public payload: string) {}
}

export class UpdateUserData {
  static readonly type = '[Auth] Update User Data';
  constructor(public payload: UserModel) {}
}