import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Optional,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonRouterOutlet, IonicModule, ModalController } from '@ionic/angular';
import { IconPickerModalComponent } from './modals/icon-picker-modal/icon-picker-modal.component';
import { tint } from 'src/app/utils/color-functions';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class IconPickerComponent {
  @Input() control!: FormControl;
  @Input() color!: string;

  private modalController: ModalController = inject(ModalController);

  _color: string = '#fff';

  constructor(@Optional() private readonly routerOutlet?: IonRouterOutlet) {}

  ngOnChanges({ color }: SimpleChanges) {
    if (color) {
      if (this.color) {
        this._color = tint(this.color, 0.7);
      }
    }
  }

  async openIconPicker() {
    const modal = await this.modalController.create({
      component: IconPickerModalComponent,
      componentProps: {
        icon: this.control.value,
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
