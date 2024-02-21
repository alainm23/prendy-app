import { Business } from './business.object';
import { ObjectType } from 'src/app/core/enums/object.enum';

export class BaseObject {
  id: string = '';
  is_deleted: boolean = false;
  is_archived: boolean = false;
  is_favorite: boolean = false;

  get objectType(): ObjectType {
    if (this instanceof Business) {
      return ObjectType.BUSINESS;
    }

    return ObjectType.NONE;
  }

  get typeAdd(): string {
    if (this instanceof Business) {
      return 'business_add';
    }

    return '';
  }

  get typeDelete(): string {
    if (this instanceof Business) {
      return 'business_delete';
    }

    return '';
  }

  getAddJSON(uuid: string, temp_id: string) {
    return {};
  }

  getUpdateJSON(uuid: string, temp_id: string | null = null): any {
    return {};
  }

  getDeleteJSON(uuid: string) {
    return {};
  }
}
