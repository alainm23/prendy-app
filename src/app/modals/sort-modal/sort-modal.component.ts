import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ItemReorderEventDetail } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { first } from 'rxjs';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';
import { Business } from 'src/app/core/objects/business.object';
import { DatabaseService } from 'src/app/services/database/database.service';
import { SignalsProvider } from 'src/app/services/signals.service';

@Component({
  selector: 'app-sort-modal',
  templateUrl: './sort-modal.component.html',
  styleUrls: ['./sort-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
})
export class SortModalComponent extends BaseModalComponent implements OnInit {
  private _databaseService: DatabaseService = inject(DatabaseService);
  private _signalsProvider: SignalsProvider = inject(SignalsProvider);

  items: Business[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    this._subcriptions['business'] = this._databaseService.business
      .pipe(first())
      .subscribe((value: Business[]) => {
        this.items = value.sort((item1: Business, item2: Business) => {
          return item1.order - item2.order;
        });
      });
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.items = ev.detail.complete(this.items);

    this.items.forEach((value: Business, index: number) => {
      value.order = index;
      this._databaseService.updateBusiness(value);
    });
  }
}
