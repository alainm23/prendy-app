import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';
import { DatabaseService } from './database/database.service';
import { generateUUID } from '../utils/common-functions';
import { AuthService } from './auth.service';
import { SyncModel } from '../core/interfaces/sync.model';
import { Business } from '../core/objects/business.object';
import { BaseObject } from '../core/objects/base.object';
import { ObjectType } from '../core/enums/object.enum';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  private _httpClient: HttpClient = inject(HttpClient);
  private _databaseService: DatabaseService = inject(DatabaseService);
  private _authService: AuthService = inject(AuthService);
  private _sync_api = `${environment.api}api/sync/v1/sync`;
  private _apiService: ApiService = inject(ApiService);

  sync() {
    const token = localStorage.getItem('token');
    const sync_token = localStorage.getItem('sync_token');
    const url = `${this._sync_api}`;

    const body = {
      sync_token: sync_token,
      resource_types: ['all'],
    };

    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };

    return this._httpClient.post(url, body, headers);
  }

  firstSync(sync_type: string, token: string, commands: any) {
    const url = `${this._sync_api}/first`;

    return this._httpClient
      .post(
        url,
        { sync_type, commands },
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        }
      )
      .pipe(
        map(async (response: any) => {
          if (response.status) {
            await this.runSyncData(response.data);
            return response.data;
          } else {
            throw new Error(response.message);
          }
        })
      );
  }

  async runSyncData(sync_data: SyncModel) {
    this._authService.setSyncToken(sync_data.sync_token);
    this._authService.updateUserData(sync_data.user);

    this._databaseService.clearCollections().subscribe({
      next: () => {
        const businesses = sync_data.businesses;
        businesses.forEach((data: Record<string, any>) => {
          this._databaseService.insertBusiness(Business.fromJSON(data));
        });
      },
    });
  }

  async generateCommands() {
    const collections: any = await this._databaseService.getCollections();

    let commands: any[] = [];

    for (let index = 0; index < collections.businesses.length; index++) {
      const business = collections.businesses[index] as Business;
      const temp_id: string = generateUUID();
      const uuid: string = generateUUID();

      commands = [...commands, business.getAddJSON(uuid, temp_id)];
    }

    return commands;
  }

  /*
   * Add Item
   *
   */

  async addItem(object: BaseObject): Promise<any> {
    object.id = uuidv4();
    return this.addLocal(object).then(() => {
      if (this._authService.isAuthenticated) {
        this.add(object);
      }
    });
  }

  add(object: BaseObject): Promise<BaseObject> {
    return new Promise((resolve, reject) => {
      const url = `${this._sync_api}`;
      const uuid = uuidv4();
      const temp_id = uuidv4();
      const body = {
        commands: [object.getAddJSON(uuid, temp_id)],
      };

      this._apiService.post(url, body, true).subscribe({
        next: (resp: any) => {
          const sync_status = resp.sync_status;
          const temp_id_mapping = resp.temp_id_mapping;

          if (sync_status[uuid] === 'ok') {
            const old_id = object.id;
            object.id = temp_id_mapping[temp_id];
            this._authService.setSyncToken(resp.sync_token);

            if (object.objectType === ObjectType.BUSINESS) {
              this._databaseService
                .updateBusinessID(object as Business, old_id)
                .then(() => resolve(object))
                .catch((error: any) => reject(error));
            }
          } else {
            reject(resp.sync_status[uuid]);
          }
        },
        error: (error: any) => reject(error),
      });
    });
  }

  addLocal(object: BaseObject): Promise<Business> {
    return new Promise((resolve, reject) => {
      if (object.objectType === ObjectType.BUSINESS) {
        this._databaseService
          .insertBusiness(object as Business)
          .then(() => resolve(object as Business))
          .catch((error: any) => reject(error));
      }
    });
  }

  /*
   * Update Item
   *
   */

  updateItem(object: BaseObject) {
    if (this._authService.isAuthenticated) {
      return this.update(object);
    } else {
      return this.deleteLocal(object);
    }
  }

  update(object: BaseObject) {
    return new Promise((resolve, reject) => {
      const url = `${this._sync_api}`;
      const uuid = uuidv4();
      const body = {
        commands: [object.getUpdateJSON(uuid)],
      };

      this._apiService.post(url, body, true).subscribe({
        next: (resp: any) => {
          if (resp.sync_status[uuid] === 'ok') {
            this._authService.setSyncToken(resp.sync_token);
            this.updateLocal(object)
              .then(() => {
                resolve(true);
              })
              .catch(error => {
                reject(error);
              });
          } else {
            reject(resp.sync_status[uuid]);
          }
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  updateLocal(object: BaseObject) {
    return new Promise((resolve, reject) => {
      if (object.objectType === ObjectType.BUSINESS) {
        this._databaseService
          .updateBusiness(object as Business)
          .then(() => {
            resolve(true);
          })
          .catch((error: any) => {
            reject(error);
          });
      }
    });
  }

  /*
   * Delete Item
   *
   */

  deleteItem(object: BaseObject) {
    if (this._authService.isAuthenticated) {
      return this.delete(object);
    } else {
      return this.deleteLocal(object);
    }
  }

  deleteLocal(object: BaseObject) {
    return new Promise((resolve, reject) => {
      if (object.objectType === ObjectType.BUSINESS) {
        this._databaseService
          .deleteBusiness(object as Business)
          .then(() => {
            resolve(true);
          })
          .catch((error: any) => {
            reject(error);
          });
      }
    });
  }

  delete(object: BaseObject) {
    return new Promise((resolve, reject) => {
      const url = `${this._sync_api}`;
      const uuid = uuidv4();
      const body = {
        commands: [object.getDeleteJSON(uuid)],
      };

      this._apiService.post(url, body, true).subscribe({
        next: (resp: any) => {
          if (resp.sync_status[uuid] === 'ok') {
            this._authService.setSyncToken(resp.sync_token);
            this.deleteLocal(object)
              .then(() => {
                resolve(true);
              })
              .catch(error => {
                reject(error);
              });
          } else {
            reject(resp.sync_status[uuid]);
          }
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }
}
