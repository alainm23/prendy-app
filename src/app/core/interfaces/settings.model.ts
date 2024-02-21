export type AppearanceType = 'system' | 'dark' | 'light';

export interface SettingsModel {
    lang: string;
    appearance: AppearanceType;
  }