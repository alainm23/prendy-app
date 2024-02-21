import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverMenuItemInterface } from './interfaces/popover-menu-item.interface';

@Component({
  selector: 'app-popover-menu',
  templateUrl: './popover-menu.component.html',
  styleUrls: ['./popover-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
})
export class PopoverMenuComponent implements OnInit {
  @Input() menuItems: PopoverMenuItemInterface[] = [];

  private _popoverController: PopoverController = inject(PopoverController);
  constructor() {}

  ngOnInit() {}

  closeMenu() {
    this._popoverController.dismiss();
  }

  action (item: PopoverMenuItemInterface) {
    this.closeMenu();
    if (item.action) {
      item.action();
    } 
  }
}
