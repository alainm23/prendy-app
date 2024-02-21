import { BusinessModel } from 'src/app/core/interfaces/business.model';
import { Business } from 'src/app/core/objects/business.object';

export class SetBusiness {
  static readonly type = '[collection] SetBusiness';
  constructor(public payload: any[]) {}
}

export class AddBusiness {
  static readonly type = '[collection] AddBusiness';
  constructor(public payload: Business) {}
}

export class UpdateBusiness {
  static readonly type = '[collection] UpdateBusiness';
  constructor(public payload: Business) {}
}

export class UpdateBusinessID {
  static readonly type = '[collection] Update Business ID';
  constructor(
    public id: string,
    public payload: Business
  ) {}
}

export class DeleteBusiness {
  static readonly type = '[collection] Delete Business';
  constructor(public id: string) {}
}

export class ClearCollections {
  static readonly type = '[collection] Clear Collections';
  constructor() {}
}
