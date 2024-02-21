import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BaseModalComponent } from 'src/app/core/components/base-modal.component';
import { icons } from 'src/app/core/constants/default.constants';

@Component({
  selector: 'app-icon-picker-modal',
  templateUrl: './icon-picker-modal.component.html',
  styleUrls: ['./icon-picker-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
],
})
export class IconPickerModalComponent
  extends BaseModalComponent
  implements OnInit
{
  @Input() icon!: string;

  icons: WritableSignal<string[]> = signal<string[]>(icons);

  private modalController: ModalController = inject(ModalController);

  constructor() {
    super();
  }

  ngOnInit() {}

  selectIcon(_icon: string) {
    this.modalController.dismiss(_icon);
  }
}
