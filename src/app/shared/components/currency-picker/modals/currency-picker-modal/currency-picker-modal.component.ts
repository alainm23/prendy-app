import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import CurrencyList from 'currency-list';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';

@Component({
  selector: 'app-currency-picker-modal',
  templateUrl: './currency-picker-modal.component.html',
  styleUrls: ['./currency-picker-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class CurrencyPickerModalComponent
  extends BaseModalComponent
  implements OnInit
{
  @Input() currency!: string;

  items: any[] = [];
  _items: any[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    this.items = [...Object.values(CurrencyList.getAll('en'))];
    this._items = [...this.items];
  }

  currencySelected(event: any) {
    this._modalController.dismiss(event.detail.value);
  }

  filter(event: any) {
    const searchTerm = event.detail.value;

    this.items = this._items.filter(
      currency =>
        currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
