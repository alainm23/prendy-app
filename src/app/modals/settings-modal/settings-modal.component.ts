import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonNav, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings.service';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';
import { AppearanceComponent } from './pages/appearance/appearance.component';
import { AccountComponent } from './pages/account/account.component';
import { SettingsModel } from 'src/app/core/interfaces/settings.model';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettingsModalComponent
  extends BaseModalComponent
  implements OnInit
{
  private _settingsService: SettingsService = inject(SettingsService);
  private _ionNav: IonNav = inject(IonNav);

  settings: WritableSignal<SettingsModel> = signal<SettingsModel>({
    lang: 'en',
    appearance: 'system',
  });

  constructor() {
    super();
  }

  ngOnInit() {
    this._subcriptions['settings'] = this._settingsService.settings.subscribe({
      next: (settings: SettingsModel) => {
        this.settings.set(settings);
      },
    });
  }

  goAccountView() {
    this._ionNav.push(AccountComponent);
  }

  goAppearanceView() {
    this._ionNav.push(AppearanceComponent);
  }

  toggleChange(ev: any) {
    this.toggleDarkTheme(ev.detail.checked);
  }

  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }
}
