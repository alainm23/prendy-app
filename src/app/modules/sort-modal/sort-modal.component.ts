import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ItemReorderEventDetail } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { first } from 'rxjs';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';
import { Business } from 'src/app/core/objects/business.object';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-sort-modal',
  templateUrl: './sort-modal.component.html',
  styleUrls: ['./sort-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
})
export class SortModalComponent extends BaseModalComponent implements OnInit {
  private _databaseService: DatabaseService = inject(DatabaseService);

  items: Business[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    this._subcriptions['business'] = this._databaseService
      .getAllBusiness()
      .pipe(first())
      .subscribe((value: any[]) => {
        this.items = [...value];
      });
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.items = ev.detail.complete(this.items);

    const items = this.items.map((value: Business, index: number) => {
      return { ...value, order: index };
    });

    items.forEach((item: Record<string, any>) => {
      this._databaseService.updateBusiness(Business.fromJSON(item));
    });
  }
}
