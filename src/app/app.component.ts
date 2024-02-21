import { Component, OnInit, inject } from '@angular/core';
import { DatabaseService } from './services/database/database.service';
import { SettingsService } from './services/settings.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private _databaseService: DatabaseService = inject(DatabaseService);
  private _settingsService: SettingsService = inject(SettingsService);
  private _authService: AuthService = inject(AuthService);

  constructor() {}

  async ngOnInit(): Promise<void> {
    await this._databaseService.init();
    this._settingsService.loadSettings();
    this._authService.checkSession();
  }
}
