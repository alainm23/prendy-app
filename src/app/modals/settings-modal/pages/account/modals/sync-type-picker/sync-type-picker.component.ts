import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-sync-type-picker',
  templateUrl: './sync-type-picker.component.html',
  styleUrls: ['./sync-type-picker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent
],
})
export class SyncTypePickerComponent
  extends BaseModalComponent
  implements OnInit
{
  control!: FormControl;
  constructor() {
    super();
  }

  async ngOnInit() {
    this.control = new FormControl('', [Validators.required]);
  }

  select() {
    if (this.control.invalid) {
      return;
    }

    this._modalController.dismiss(this.control.getRawValue());
  }
}
