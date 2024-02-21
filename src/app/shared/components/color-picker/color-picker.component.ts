import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { colors } from 'src/app/core/constants/default.constants';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
],
})
export class ColorPickerComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() label: string = '';

  colors: WritableSignal<string[]> = signal<string[]>(colors);

  ngOnInit() {}

  get colorSelected() {
    return this.control.value;
  }

  selectColor(color: string) {
    this.control.setValue(color);
  }
}
