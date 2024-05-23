import { Injectable, inject, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
// import {
//   AddBusiness,
//   ClearCollections,
//   DeleteBusiness,
//   SetBusiness,
//   UpdateBusiness,
//   UpdateBusinessID,
// } from '../../states/collection/collection.action';
import { v4 as uuidv4 } from 'uuid';
import { BusinessModel } from 'src/app/core/interfaces/business.model';
import { DB } from './default.constants';
import { Business } from 'src/app/core/objects/business.object';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private dbService: NgxIndexedDBService = inject(NgxIndexedDBService);
  // private store: Store = inject(Store);

  private _business: BehaviorSubject<Business[]> = new BehaviorSubject(
    [] as Business[]
  );

  constructor() {}

  public async init() {
    await this.getBusinessCollection();
  }

  async getBusinessCollection() {
    let returnValue: Business[] = [];

    const business = await lastValueFrom(this.dbService.getAll(DB.BUSINESSES));
    business.forEach((business: any) => {
      returnValue = [...returnValue, Business.fromJSON(business)];
    });

    this.setBusiness(returnValue);
    return returnValue;
  }

  setBusiness(business: Business[]): void {
    this._business.next(business);
  }

  get business(): Observable<Business[]> {
    return this._business.asObservable();
  }

  public get generateID() {
    return uuidv4();
  }

  // public getAllBusiness(): Observable<BusinessModel[]> {
  //   return this.store.select(state => state.collection.businesses);
  // }

  public async getCollections() {
    const businesses = await this.getBusinessCollection();

    return {
      businesses,
    };
  }

  public insertBusiness(business: Business): Promise<Business> {
    return new Promise((resolve, reject) => {
      this.dbService.add(DB.BUSINESSES, business).subscribe({
        next: () => {
          this.setBusiness([...this._business.getValue(), business]);
          resolve(business);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  public updateBusiness(payload: Business): Promise<Business> {
    return new Promise((resolve, reject) => {
      this.dbService.update(DB.BUSINESSES, { ...payload }).subscribe({
        next: () => {
          const _businesses = this._business
            .getValue()
            .map((business: any) =>
              payload.id === business.id ? payload : business
            );

          this.setBusiness(_businesses);
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

      const _businesses = this._business
        .getValue()
        .map((business: any) =>
          payload.id === business.id ? payload : business
        );

      this.setBusiness(_businesses);
      resolve(true);
    });
  }

  public async deleteBusiness(business: Business) {
    return new Promise((resolve, reject) => {
      this.dbService.deleteByKey(DB.BUSINESSES, business.id).subscribe({
        next: () => {
          this.setBusiness(
            this._business
              .getValue()
              .filter((item: BusinessModel) => item.id != business.id)
          );
          resolve(true);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  clearCollections() {
    return new Promise((resolve, reject) => {
      this.clearCollectionsDB()
        .then(() => {
          this._business.next([]);
          resolve(true);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
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
