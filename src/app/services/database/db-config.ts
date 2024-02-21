import { DBConfig } from 'ngx-indexed-db';
import { environment } from 'src/environments/environment';

export function migrationFactory() {
  return {
    // 1: (db: any, transaction: any) => {
    //   const store = transaction.objectStore('Business');
    //   store.createIndex('xxx', 'xxx', { unique: false });
    // },
  };
}

export const dbConfig: DBConfig = {
  name: environment.databaseName,
  version: environment.databaseVersion,
  objectStoresMeta: [
    {
      store: 'Businesses',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'icon', keypath: 'icon', options: { unique: false } },
        { name: 'color', keypath: 'color', options: { unique: false } },
        { name: 'currency', keypath: 'currency', options: { unique: false } },
        { name: 'order', keypath: 'order', options: { unique: false } },
        {
          name: 'is_deleted',
          keypath: 'is_deleted',
          options: { unique: false },
        },
        {
          name: 'is_archived',
          keypath: 'is_archived',
          options: { unique: false },
        },
        {
          name: 'is_favorite',
          keypath: 'is_favorite',
          options: { unique: false },
        },
      ],
    },
  ],
  migrationFactory,
};
