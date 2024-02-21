import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { IonNav, IonicModule } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base.component';
import { UserModel } from 'src/app/core/interfaces/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { AuthState } from 'src/app/states/auth/auth.state';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);

  @Select(AuthState.getUser) user$!: Observable<boolean>;
  user = signal<any>({});

  constructor() {
    super();
  }

  ngOnInit() {
    this._subcriptions['user'] = this.user$.subscribe({
      next: (user: any) => {
        this.user.set(user);
      },
    });
  }

  signOff() {
    this._authService.logout();
  }
}
