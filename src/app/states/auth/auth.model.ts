import { UserModel } from 'src/app/core/interfaces/user.model';

export interface AuthStateModel {
  readonly user: UserModel | null;
  readonly token: string | null;
  readonly sync_token: string | null;
}
