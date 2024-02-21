import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  LoadSettings,
  SetAppearance,
  SetLang,
} from '../states/settings/settings.actions';
import { Preferences } from '@capacitor/preferences';
import { Observable } from 'rxjs';
import { SettingsStateModel } from '../states/settings/settings.model';
import { AppearanceType } from '../core/interfaces/settings.model';
import { TranslateService } from '@ngx-translate/core';
import { languages } from '../core/constants/default.constants';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _store: Store = inject(Store);
  private _translateService: TranslateService = inject(TranslateService);

  private systemDark: boolean = false;

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemDark = prefersDark.matches;

    this.toggleSystemTheme();
    prefersDark.addEventListener('change', mediaQuery => {
      this.systemDark = mediaQuery.matches;
      this.toggleSystemTheme();
    });
  }

  loadSettings() {
    this._store.dispatch(new LoadSettings());
  }

  setLang(lang: string) {
    this._store.dispatch(new SetLang(lang));
  }

  getDefaultLang() {
    const browserLang = this._translateService.getBrowserLang();
    if (browserLang && languages.includes(browserLang)) {
      return browserLang;
    }

    return 'en';
  }

  setAppearance(lang: AppearanceType) {
    this._store.dispatch(new SetAppearance(lang));
  }

  async getAsyncAppearance() {
    const appearanceResult = await Preferences.get({ key: 'appearance' });
    return appearanceResult.value as AppearanceType;
  }

  getSettings(): Observable<SettingsStateModel> {
    return this._store.select(state => state.settings);
  }

  toggleDarkTheme(appearance: AppearanceType) {
    let dark: boolean = appearance === 'dark';
    if (appearance == 'system') {
      dark = this.systemDark;
    }

    document.body.classList.toggle('dark', dark);
  }

  async toggleSystemTheme() {
    this.toggleDarkTheme(await this.getAsyncAppearance());
  }
}
