import {IProductState} from "./product.state";
import {createFeatureSelector, createSelector} from "@ngrx/store";

const selectProducts = createFeatureSelector<IProductState>('product');

export const getProduct = createSelector(selectProducts, (state: IProductState) => state.product);

export const getAllProduct = createSelector(selectProducts, (state: IProductState) => state.allProducts);

export const getSuccess = createSelector(selectProducts, (state: IProductState) => state.success);

export const getError = createSelector(selectProducts, (state: IProductState) => state.error);


