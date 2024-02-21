import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { AppStateModel } from './app.model';
import { SetVersion } from './app.actions';

@State<AppStateModel>({
  name: 'app',
  defaults: {
    version: '0.0.1',
  },
})
@Injectable()
export class AppState {
  @Action(SetVersion)
  setVersion(ctx: StateContext<AppStateModel>, { payload }: SetVersion) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      version: payload,
    });
  }
}
