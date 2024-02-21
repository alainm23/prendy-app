import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';
import { AppearanceType } from 'src/app/core/interfaces/settings.model';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
],
})
export class AppearanceComponent extends BaseModalComponent implements OnInit {
  private _settingsService: SettingsService = inject(SettingsService);

  appearance!: AppearanceType;
  appearanceControl!: FormControl;

  constructor() {
    super();
  }

  async ngOnInit() {
    this.appearanceControl = new FormControl<AppearanceType>('system', [
      Validators.required,
    ]);

    this.appearance = await this._settingsService.getAsyncAppearance();
    this.appearanceControl.setValue(this.appearance);

    this.appearanceControl.valueChanges.subscribe({
      next: (newValue: any) => {
        this._settingsService.setAppearance(newValue);
      },
    });
  }
}
