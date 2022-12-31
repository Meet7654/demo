import {IOrderState} from "./order.state";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {IProductState} from "../product/product.state";

const selectOrders= createFeatureSelector<IOrderState>('order');

export const getOrder = createSelector(selectOrders, (state: IOrderState) => state.order);

export const getAllOrder = createSelector(selectOrders, (state: IOrderState) => state.allOrders);

export const getSuccess = createSelector(selectOrders, (state: IOrderState) => state.success);

export const getError = createSelector(selectOrders, (state: IOrderState) => state.error);


