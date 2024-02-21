import { BusinessModel } from './business.model';
import { UserModel } from './user.model';

export interface SyncModel {
  businesses: BusinessModel[];
  full_sync: boolean;
  sync_token: string;
  user: UserModel;
}
