import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppState } from './app/app.state';
import { CollectionState } from './collection/collection.state';
import { SettingsState } from './settings/settings.state';
import { AuthState } from './auth/auth.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot([AppState, CollectionState, SettingsState, AuthState]),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
  ],
  exports: [NgxsModule],
})
export class StoreModule {}
