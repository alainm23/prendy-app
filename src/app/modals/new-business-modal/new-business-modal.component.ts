import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  inject,
  Input,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database/database.service';
import { TranslateModule } from '@ngx-translate/core';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { ColorPickerComponent } from 'src/app/shared/components/color-picker/color-picker.component';
import { CurrencyPickerComponent } from 'src/app/shared/components/currency-picker/currency-picker.component';
import { IconPickerComponent } from 'src/app/shared/components/icon-picker/icon-picker.component';
import { Business } from 'src/app/core/objects/business.object';
import { AuthService } from 'src/app/services/auth.service';
import { SyncService } from 'src/app/services/sync.service';

@Component({
  selector: 'app-new-business-modal',
  templateUrl: './new-business-modal.component.html',
  styleUrls: ['./new-business-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    ColorPickerComponent,
    IconPickerComponent,
    CurrencyPickerComponent,
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewBusinessModalComponent
  extends BaseModalComponent
  implements OnInit
{
  @Input() business!: Business;

  private actionSheetCtrl: ActionSheetController = inject(
    ActionSheetController
  );
  private _syncService: SyncService = inject(SyncService);

  form!: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      color: new FormControl('#f98085', [Validators.required]),
      icon: new FormControl('building-store', [Validators.required]),
      currency: new FormControl('PEN', [Validators.required]),
    });

    if (this.business) {
      this.form.controls['name'].setValue(this.business.name);
      this.form.controls['color'].setValue(this.business.color);
      this.form.controls['icon'].setValue(this.business.icon);
      this.form.controls['currency'].setValue(this.business.currency);
    } else {
      this.business = new Business();
    }
  }

  get isEdit() {
    return this.business.id !== '';
  }

  submit() {
    if (this.form.invalid) {
      this.closeModal(false);
      return;
    }

    const _formValue = this.form.getRawValue();

    this.business.name = _formValue.name;
    this.business.icon = _formValue.icon;
    this.business.color = _formValue.color;
    this.business.currency = _formValue.currency;

    const action = this.isEdit
      ? this._syncService.updateItem(this.business)
      : this._syncService.addItem(this.business);

    action
      .then(() => {
        this.closeModal();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  override async closeModal(confirm: boolean = false) {
    if (confirm && this.form.valid) {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Are you sure?',
        buttons: [
          {
            text: 'Yes',
            role: 'destructive',
            handler: () => {
              this._modalController.dismiss();
            },
          },

          {
            text: 'Cancel',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ],
      });

      await actionSheet.present();
    } else {
      this._modalController.dismiss();
    }
  }
}
