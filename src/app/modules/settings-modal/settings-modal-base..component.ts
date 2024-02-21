
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-modal-base',
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  standalone: true,
  imports: [IonicModule],
})
export class SettingsModalBaseComponent implements OnInit {
  rootPage: any;

  constructor() {}

  ngOnInit() {}
}
