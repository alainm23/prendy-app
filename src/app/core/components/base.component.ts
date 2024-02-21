import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  template: '',
})
export class BaseComponent {
  public _subcriptions: Record<string, Subscription> = {};

  constructor() {}

  ngOnDestroy(): void {
    Object.values(this._subcriptions).map(value => value.unsubscribe());
  }

  public trackItems(index: number, item: any) {
    return item && item.id ? item.id : index;
  }
}
