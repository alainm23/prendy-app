import { Injectable, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import {
  AppearanceType,
  SettingsModel,
} from '../core/interfaces/settings.model';
import { TranslateService } from '@ngx-translate/core';
import { languages } from '../core/constants/default.constants';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _translateService: TranslateService = inject(TranslateService);

  private systemDark: boolean = false;

  private defaultSettings: SettingsModel = {
    lang: 'es',
    appearance: 'system',
  };

  private _settings: BehaviorSubject<SettingsModel> = new BehaviorSubject(
    this.defaultSettings as SettingsModel
  );

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemDark = prefersDark.matches;

    this.toggleSystemTheme();
    prefersDark.addEventListener('change', mediaQuery => {
      this.systemDark = mediaQuery.matches;
      this.toggleSystemTheme();
    });
  }

  async loadSettings() {
    const langResult = await Preferences.get({ key: 'lang' });
    const appearanceResult = await Preferences.get({ key: 'appearance' });

    this.setAppLang(langResult.value || this.getDefaultLang());
    this.toggleDarkTheme(appearanceResult.value as AppearanceType);

    this.setSettings({
      lang: langResult.value || this.getDefaultLang(),
      appearance: appearanceResult.value as AppearanceType,
    });
  }

  setAppLang(lang: string) {
    this._translateService.use(lang);
  }

  setSettings(settings: SettingsModel) {
    this._settings.next(settings);
  }

  get settings() {
    return this._settings.asObservable();
  }

  async setLang(lang: string) {
    await Preferences.set({
      key: 'lang',
      value: lang,
    });

    this.setAppLang(lang);

    this.setSettings({
      ...this._settings.getValue(),
      lang: lang,
    });
  }

  getDefaultLang() {
    const browserLang = this._translateService.getBrowserLang();
    if (browserLang && languages.includes(browserLang)) {
      return browserLang;
    }

    return 'en';
  }

  async setAppearance(lang: AppearanceType) {
    await Preferences.set({
      key: 'appearance',
      value: lang,
    });

    await this.toggleSystemTheme();

    this.setSettings({
      ...this._settings.getValue(),
      appearance: lang,
    });
  }

  async getAsyncAppearance() {
    const appearanceResult = await Preferences.get({ key: 'appearance' });
    return appearanceResult.value as AppearanceType;
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
