import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonRouterOutlet,
  IonicModule,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database/database.service';
import { PopoverMenuItemInterface } from 'src/app/shared/components/popover-menu/interfaces/popover-menu-item.interface';
import { PopoverMenuComponent } from 'src/app/shared/components/popover-menu/popover-menu.component';
import { LongPressDirective } from 'src/app/shared/directives/long-press.directive';
import { NewBusinessModalComponent } from 'src/app/modules/new-business-modal/new-business-modal.component';
import { Business } from 'src/app/core/objects/business.object';
import { SyncService } from 'src/app/services/sync.service';

@Component({
  selector: 'app-business-item',
  templateUrl: './business-item.component.html',
  styleUrls: ['./business-item.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    LongPressDirective,
    TranslateModule,
  ],
})
export class BusinessItemComponent {
  @Input() business!: Business;
  @Output() selected = new EventEmitter<Business>();

  private _popoverController: PopoverController = inject(PopoverController);
  private _modalController: ModalController = inject(ModalController);
  private _databaseService: DatabaseService = inject(DatabaseService);
  private _routerOutlet: IonRouterOutlet = inject(IonRouterOutlet);
  private _syncService: SyncService = inject(SyncService);

  popover: HTMLIonPopoverElement | null = null;

  async openTemplateMenu(e: any) {
    if (this.popover) {
      return;
    }

    const menuItems: PopoverMenuItemInterface[] = [
      {
        name: 'Edit',
        icon: 'edit',
        action: () => {
          this.edit();
        },
      },
      {
        name: 'Archive',
        icon: 'archive',
        action: () => {},
      },
      {
        name: 'Delete',
        icon: 'trash',
        action: () => {
          this._syncService.deleteItem(this.business);
        },
      },
    ];

    this.popover = await this._popoverController.create({
      component: PopoverMenuComponent,
      componentProps: {
        menuItems: menuItems,
      },
      event: e,
      translucent: true,
      arrow: true,
    });

    this.popover.onDidDismiss().then(() => {
      this.popover = null;
    });

    await this.popover.present();
  }

  selectItem() {
    this.selected.emit(this.business);
  }

  async edit() {
    const modal = await this._modalController.create({
      component: NewBusinessModalComponent,
      componentProps: {
        business: this.business,
      },
      presentingElement: this._routerOutlet.nativeEl,
    });

    await modal.present();
  }
}
