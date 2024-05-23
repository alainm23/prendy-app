import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    ProfileComponent,
    SignInComponent,
  ],
})
export class AccountComponent extends BaseModalComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  view = signal<string>('signin');

  constructor() {
    super();
  }

  ngOnInit() {
    this._authService.authState.subscribe({
      next: () => {
        this.view.set(this._authService.isAuthenticated ? 'account' : 'signin');
      },
    });
  }
}
