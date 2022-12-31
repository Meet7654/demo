import {createAction, props} from "@ngrx/store";
import {Order} from "../../models/order";
import {Product} from "../../models/product";

enum EOrderActions {
  AddOrder = '[Order] Add Order',
  AddOrderSuccess = '[Order] Add Order Success',
  AddOrderError = '[Order] Add Order Error',
  ListOrder = '[Order] List Order',
  ListOrderSuccess = '[Order] List Order Success',
  ListOrderError = '[Order] List Order Error',
  ResetOrderState = '[Order] Reset Order State',
}

export const AddOrder = createAction(EOrderActions.AddOrder, props<{ order: any }>());
export const AddOrderSuccess = createAction(EOrderActions.AddOrderSuccess, props<{ order: Order }>());
export const AddOrderError = createAction(EOrderActions.AddOrderError, props<{ error: string }>());

export const ListOrder = createAction(EOrderActions.ListOrder, (params: any = {}) => params);
export const ListOrderSuccess = createAction(EOrderActions.ListOrderSuccess, props<{ order: Order[] }>());
export const ListOrderError = createAction(EOrderActions.ListOrderError, props<{ error: string }>());
export const ResetOrderState = createAction(EOrderActions.ResetOrderState, (params: any = {}) => params);
