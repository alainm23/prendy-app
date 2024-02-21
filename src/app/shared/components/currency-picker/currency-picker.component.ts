import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Optional,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonRouterOutlet, IonicModule, ModalController } from '@ionic/angular';
import { CurrencyPickerModalComponent } from './modals/currency-picker-modal/currency-picker-modal.component';
import CurrencyList from 'currency-list';
import { TranslateModule } from '@ngx-translate/core';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';

@Component({
  selector: 'app-currency-picker',
  templateUrl: './currency-picker.component.html',
  styleUrls: ['./currency-picker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
],
})
export class CurrencyPickerComponent
  extends BaseModalComponent
  implements OnInit
{
  @Input() label: string = '';
  @Input() control!: FormControl;

  private modalController: ModalController = inject(ModalController);

  currencyData = signal<any>(null);

  constructor(@Optional() private readonly routerOutlet?: IonRouterOutlet) {
    super();
  }

  ngOnInit() {
    if (this.control.valid) {
      this.currencyData.set(CurrencyList.get(this.control.value));
    }
    
    this._subcriptions['control'] = this.control.valueChanges.subscribe(
      (newValue: string) => {
        this.currencyData.set(CurrencyList.get(newValue));
      }
    );
  }

  async openCurrencyPicker() {
    const modal = await this.modalController.create({
      component: CurrencyPickerModalComponent,
      componentProps: {
        currency: this.control.value,
      },
      presentingElement:
        this.routerOutlet == null
          ? await this.modalController.getTop()
          : this.routerOutlet.nativeEl,
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.control.setValue(data);
      }
    });

    await modal.present();
  }
}
