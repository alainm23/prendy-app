import { Component, OnInit, inject } from '@angular/core';
import {
  IonRouterOutlet,
  ModalController,
  NavController,
} from '@ionic/angular';
import { BaseComponent } from 'src/app/core/components/base.component';
import { DatabaseService } from 'src/app/services/database/database.service';
import { NewBusinessModalComponent } from '../../modals/new-business-modal/new-business-modal.component';
import { SettingsModalBaseComponent } from '../../modals/settings-modal/settings-modal-base..component';
import { SettingsModalComponent } from '../../modals/settings-modal/settings-modal.component';
import { SortModalComponent } from '../../modals/sort-modal/sort-modal.component';
import { Business } from 'src/app/core/objects/business.object';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage extends BaseComponent implements OnInit {
  private navController: NavController = inject(NavController);
  private modalController: ModalController = inject(ModalController);
  private routerOutlet: IonRouterOutlet = inject(IonRouterOutlet);
  private _databaseService: DatabaseService = inject(DatabaseService);

  business: Business[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    this._subcriptions['all-business'] =
      this._databaseService.business.subscribe((value: any[]) => {
        this.business = [...value];
      });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  goView(item: number) {
    this.navController.navigateForward(['business']);
  }

  async openSortModal() {
    const modal = await this.modalController.create({
      component: SortModalComponent,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();
  }

  async openNewBusinessModal() {
    const modal = await this.modalController.create({
      component: NewBusinessModalComponent,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      presentingElement: this.routerOutlet.nativeEl,
      canDismiss: true,
      component: SettingsModalBaseComponent,
      componentProps: {
        rootPage: SettingsModalComponent,
      },
    });

    modal.onDidDismiss().then(() => {});

    await modal.present();
  }
}
