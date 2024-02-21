import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from './base.component';

@Component({
  template: '',
})
export class BaseModalComponent extends BaseComponent {
  _modalController: ModalController = inject(ModalController);

  constructor() {
    super();
  }

  closeModal() {
    this._modalController.dismiss();
  }
}
