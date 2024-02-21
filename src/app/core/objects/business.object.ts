import { tint } from 'src/app/utils/color-functions';
import { BaseObject } from './base.object';

export class Business extends BaseObject {
  name: string = '';
  icon: string = '';
  color: string = '';
  order: number = 0;
  currency: string = '';

  constructor() {
    super();
  }

  static fromJSON(json: Record<string, any>): Business {
    const object = new Business();

    object.id = json['id'];
    object.name = json['name'];
    object.icon = json['icon'];
    object.color = json['color'];
    object.order = json['order'];
    object.currency = json['currency'];
    object.is_archived = json['is_archived'] ?? false;
    object.is_deleted = json['is_deleted'] ?? false;
    object.is_favorite = json['is_favorite'] ?? false;

    return object;
  }

  public update() {}

  override getAddJSON(uuid: string, temp_id: string) {
    return {
      type: 'business_add',
      temp_id: temp_id,
      uuid: uuid,
      args: {
        name: this.name,
        icon: this.icon,
        color: this.color,
        order: this.order,
        currency: this.currency,
      },
    };
  }

  override getUpdateJSON(uuid: string, temp_id: string | null = null) {
    return {
      type: 'business_update',
      uuid: uuid,
      args: {
        id: this.id,
        name: this.name,
        icon: this.icon,
        color: this.color,
        order: this.order,
        currency: this.currency,
      },
    };
  }

  override getDeleteJSON(uuid: string) {
    return {
      type: 'business_delete',
      uuid: uuid,
      args: {
        id: this.id,
      },
    };
  }

  get iconBGColor() {
    return tint(this.color, 0.7);
  }
}
