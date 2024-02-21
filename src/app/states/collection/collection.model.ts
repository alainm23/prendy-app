import { BusinessModel } from "src/app/core/interfaces/business.model";

export interface CollectionStateModel {
    businesses: BusinessModel[],
    contacts: any[],
    categories: any[],
    products: any[],
}