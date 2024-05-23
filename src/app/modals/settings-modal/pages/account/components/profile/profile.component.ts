import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BaseComponent } from 'src/app/core/components/base.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);

  user = signal<any>({});

  constructor() {
    super();
  }

  ngOnInit() {
    this._subcriptions['user'] = this._authService.user.subscribe({
      next: (user: any) => {
        this.user.set(user);
      },
    });
  }

  signOff() {
    this._authService.logout();
  }
}
