import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { SettingsStateModel } from './settings.model';
import { LoadSettings, SetAppearance, SetLang } from './settings.actions';
import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../services/settings.service';
import { AppearanceType } from 'src/app/core/interfaces/settings.model';

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    lang: 'en',
    appearance: 'system',
  },
})
@Injectable()
export class SettingsState {
  constructor(
    private _translateService: TranslateService,
    private _settingsService: SettingsService
  ) {}

  @Action(LoadSettings)
  async loadSettings(ctx: StateContext<SettingsStateModel>) {
    const langResult = await Preferences.get({ key: 'lang' });
    const appearanceResult = await Preferences.get({ key: 'appearance' });

    this.setAppLang(langResult.value || this._settingsService.getDefaultLang());
    this.setAppAppearance(appearanceResult.value as AppearanceType);

    const state = ctx.getState();
    ctx.setState({
      ...state,
      lang: langResult.value || this._settingsService.getDefaultLang(),
      appearance: appearanceResult.value as AppearanceType,
    });
  }

  @Action(SetLang)
  async setBusiness(
    ctx: StateContext<SettingsStateModel>,
    { payload }: SetLang
  ) {
    await Preferences.set({
      key: 'lang',
      value: payload,
    });

    this.setAppLang(payload);

    const state = ctx.getState();
    ctx.setState({
      ...state,
      lang: payload,
    });
  }

  @Action(SetAppearance)
  async setAppearance(
    ctx: StateContext<SettingsStateModel>,
    { payload }: SetAppearance
  ) {
    await Preferences.set({
      key: 'appearance',
      value: payload,
    });

    this.setAppAppearance(payload);

    const state = ctx.getState();
    ctx.setState({
      ...state,
      appearance: payload,
    });
  }

  setAppLang(lang: string) {
    this._translateService.use(lang);
  }

  setAppAppearance(appearance: AppearanceType) {
    this._settingsService.toggleDarkTheme(appearance);
  }
}
