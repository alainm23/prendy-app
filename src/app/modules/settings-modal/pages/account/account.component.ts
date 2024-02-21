import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { AuthState } from 'src/app/states/auth/auth.state';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ProfileComponent } from './components/profile/profile.component';

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
    SignInComponent
],
})
export class AccountComponent extends BaseModalComponent implements OnInit {
  view = signal<string>('signin');
  @Select(AuthState.isAuthenticated) authenticated$!: Observable<boolean>;

  constructor() {
    super();
  }

  ngOnInit() {
    this.authenticated$.subscribe({
      next: (value: boolean) => {
        this.view.set(value ? 'account' : 'signin');
      },
    });
  }
}
