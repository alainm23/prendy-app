export class SetVersion {
  static readonly type = '[app] Set Version';

  constructor(public payload: string) {}
}
