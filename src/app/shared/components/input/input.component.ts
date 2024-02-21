import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class InputComponent implements OnInit {
  @Input() label: string = '';
  @Input() control!: FormControl;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';

  constructor() {}

  ngOnInit() {}
}
