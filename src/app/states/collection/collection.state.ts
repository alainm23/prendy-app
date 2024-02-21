import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CollectionStateModel } from './collection.model';
import {
  AddBusiness,
  ClearCollections,
  DeleteBusiness,
  SetBusiness,
  UpdateBusiness,
  UpdateBusinessID,
} from './collection.action';
import { BusinessModel } from 'src/app/core/interfaces/business.model';
import { DatabaseService } from 'src/app/services/database/database.service';
import { Business } from 'src/app/core/objects/business.object';

@State<CollectionStateModel>({
  name: 'collection',
  defaults: {
    businesses: [],
    contacts: [],
    categories: [],
    products: [],
  },
})
@Injectable()
export class CollectionState {
  constructor(private readonly _databaseService: DatabaseService) {}

  @Action(SetBusiness)
  setBusiness(
    ctx: StateContext<CollectionStateModel>,
    { payload }: SetBusiness
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      businesses: payload,
    });
  }

  @Action(AddBusiness)
  addBusiness(
    ctx: StateContext<CollectionStateModel>,
    { payload }: AddBusiness
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      businesses: [...state.businesses, payload],
    });
  }

  @Action(UpdateBusiness)
  updateBusiness(
    ctx: StateContext<CollectionStateModel>,
    { payload }: UpdateBusiness
  ) {
    const state = ctx.getState();

    const updatedBusiness = state.businesses.map((business: any) =>
      payload.id === business.id ? payload : business
    );

    ctx.setState({
      ...state,
      businesses: updatedBusiness,
    });
  }

  @Action(UpdateBusinessID)
  updateBusinessId(
    ctx: StateContext<CollectionStateModel>,
    { id, payload }: UpdateBusinessID
  ) {
    const state = ctx.getState();

    const updatedBusiness = state.businesses.map((business: any) =>
      id === business.id ? payload : business
    );

    ctx.setState({
      ...state,
      businesses: updatedBusiness,
    });
  }

  @Action(DeleteBusiness)
  deleteBusiness(
    ctx: StateContext<CollectionStateModel>,
    { id }: DeleteBusiness
  ) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      businesses: state.businesses.filter(
        (item: BusinessModel) => item.id != id
      ),
    });
  }

  @Action(ClearCollections)
  async clearCollections(ctx: StateContext<CollectionStateModel>) {
    return this._databaseService.clearCollectionsDB().then(() => {
      ctx.setState({
        ...ctx.getState(),
        businesses: [],
        contacts: [],
        categories: [],
        products: [],
      });
    });
  }
}
