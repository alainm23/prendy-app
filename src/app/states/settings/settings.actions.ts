export class LoadSettings {
  static readonly type = '[collection] LoadSettings';
  constructor() {}
}

export class SetLang {
  static readonly type = '[collection] SetLang';
  constructor(public payload: string) {}
}

export class SetAppearance {
  static readonly type = '[collection] SetAppearance';
  constructor(public payload: 'system' | 'dark' | 'light') {}
}
