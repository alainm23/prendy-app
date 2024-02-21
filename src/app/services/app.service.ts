import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private readonly _platform: Platform) {
    this._platform.resume.subscribe(async () => {
      // this.checkNetwork(await this._NetworkProvider.isConnect());
    });

    this._platform.pause.subscribe(() => {
      // this._AppFacade.addCustomApp({ isNetworkON: undefined });
    });
  }
}
