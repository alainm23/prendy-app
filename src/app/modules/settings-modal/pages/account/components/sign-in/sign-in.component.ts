import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { Observable, filter, lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Select } from '@ngxs/store';
import { AuthState } from 'src/app/states/auth/auth.state';
import { BaseComponent } from 'src/app/core/components/base.component';
import { SyncTypePickerComponent } from '../../modals/sync-type-picker/sync-type-picker.component';
import { SyncService } from 'src/app/services/sync.service';
import { SyncModel } from 'src/app/core/interfaces/sync.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
  ],
})
export class SignInComponent extends BaseComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _alertController: AlertController = inject(AlertController);
  private _modalController: ModalController = inject(ModalController);
  private _syncService: SyncService = inject(SyncService);

  form!: FormGroup;
  loading = signal<boolean>(false);

  @Select(AuthState.isAuthenticated) authenticated$!: Observable<boolean>;

  constructor() {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  async submit() {
    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.loading.set(true);

    try {
      const { data }: any = await lastValueFrom(
        this._authService.login(email, password)
      );

      this.loading.set(false);

      const sync_type = await this.openSyncTypemodal();

      if (!sync_type) {
        return;
      }

      this._authService.loginSuccess({
        user: data.user,
        token: data.accessToken,
      });

      const commands = await this._syncService.generateCommands();

      this._syncService
        .firstSync(sync_type, data.accessToken, commands)
        .subscribe({
          next: () => {},
        });
    } catch (error) {
      this.loading.set(false);

      const alert = await this._alertController.create({
        header:
          'The password you entered is incorrect. Please check it and try again.',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }

  async openSyncTypemodal() {
    const modal = await this._modalController.create({
      canDismiss: true,
      component: SyncTypePickerComponent,
      backdropDismiss: false,
      cssClass: 'picker-modal',
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    return data;
  }
}
