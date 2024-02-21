import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, lastValueFrom } from 'rxjs';
import {
  AddBusiness,
  ClearCollections,
  DeleteBusiness,
  SetBusiness,
  UpdateBusiness,
  UpdateBusinessID,
} from '../../states/collection/collection.action';
import { v4 as uuidv4 } from 'uuid';
import { BusinessModel } from 'src/app/core/interfaces/business.model';
import { DB } from './default.constants';
import { AuthService } from '../auth.service';
import { Business } from 'src/app/core/objects/business.object';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private dbService: NgxIndexedDBService = inject(NgxIndexedDBService);
  private store: Store = inject(Store);

  constructor() {}

  public async init() {
    const business = await this.getProjectsCollection();
    this.store.dispatch(new SetBusiness(business));
  }

  async getProjectsCollection() {
    let returnValue: Business[] = [];

    const business = await lastValueFrom(this.dbService.getAll(DB.BUSINESSES));
    business.forEach((business: any) => {
      returnValue = [...returnValue, Business.fromJSON(business)];
    });

    return returnValue;
  }

  insertBusiness(business: Business) {
    return new Promise((resolve, reject) => {
      this.dbService.add(DB.BUSINESSES, business).subscribe({
        next: () => {
          this.store.dispatch(new AddBusiness(business));
          resolve(business);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  public get generateID() {
    return uuidv4();
  }

  public getAllBusiness(): Observable<BusinessModel[]> {
    return this.store.select(state => state.collection.businesses);
  }

  public async getCollections() {
    const businesses = await this.getProjectsCollection();

    return {
      businesses,
    };
  }

  public updateBusiness(payload: Business) {
    return new Promise((resolve, reject) => {
      this.dbService.update(DB.BUSINESSES, { ...payload }).subscribe({
        next: () => {
          this.store.dispatch(new UpdateBusiness(payload));
          resolve(payload);
        },
        error: error => {
          reject(error);
        },
      });
    });
  }

  public updateBusinessID(payload: Business, oldId: string) {
    return new Promise(async (resolve, reject) => {
      const deleteStatus = await lastValueFrom(
        this.dbService.deleteByKey(DB.BUSINESSES, oldId)
      );

      if (!deleteStatus) {
        reject(false);
      }

      const addStatus = await lastValueFrom(
        this.dbService.add(DB.BUSINESSES, payload)
      );

      if (!addStatus) {
        reject(false);
      }

      this.store.dispatch(new UpdateBusinessID(oldId, payload));
      resolve(true);
    });
  }

  public async deleteBusiness(business: Business) {
    return new Promise((resolve, reject) => {
      this.dbService.deleteByKey(DB.BUSINESSES, business.id).subscribe({
        next: () => {
          this.store.dispatch(new DeleteBusiness(business.id));
          resolve(true);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  clearCollections() {
    return this.store.dispatch(new ClearCollections());
  }

  async clearCollectionsDB() {
    const businesses = await lastValueFrom(
      this.dbService.getAll(DB.BUSINESSES)
    );

    const status = await lastValueFrom(
      this.dbService.bulkDelete(
        DB.BUSINESSES,
        businesses.map((i: any) => i.id)
      )
    );

    return status;
  }
}
