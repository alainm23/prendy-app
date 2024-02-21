import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class ButtonComponent  implements OnInit {
  @Input() submit: string = '';
  @Input() expand: string = '';
  @Input() label: string = '';
  @Input() loading: boolean = false;

  constructor() { }

  ngOnInit() {}

}
