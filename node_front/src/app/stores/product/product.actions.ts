import {Product} from "../../models/product";
import {createAction, props} from "@ngrx/store";

enum EProductActions {
  AddProduct = '[Product] Add Product',
  AddProductSuccess = '[Product] Add Product Success',
  AddProductError = '[Product] Add Product Error',

  ProductList = '[Product] Product List',
  ProductListSuccess = '[Product] Product List Success',
  ProductListError = '[Product] Product List Error',
  GetProduct = '[Product] Product Get',
  GetProductSuccess = '[Product] Product Get Success',
  GetProductError = '[Product] Product Get Error',
  ResetProductState = '[Product] Reset Product State',
}

export const AddProduct = createAction(EProductActions.AddProduct, props<{ body: any,product: any }>());
export const AddProductSuccess = createAction(EProductActions.AddProductSuccess, props<{ product: Product }>());
export const AddProductError = createAction(EProductActions.AddProductError, props<{ error: string }>());

export const ProductList = createAction(EProductActions.ProductList, (params: any = {}) => params);
export const ProductListSuccess = createAction(EProductActions.ProductListSuccess, props<{ product: Product[] }>());
export const ProductListError = createAction(EProductActions.ProductListError, props<{ error: string }>());

export const GetProduct = createAction(EProductActions.GetProduct, (params: any = {}) => params);
export const GetProductSuccess = createAction(EProductActions.GetProductSuccess, props<{ product: Product[] }>());
export const GetProductError = createAction(EProductActions.GetProductError, props<{ error: string }>());
export const ResetProductState = createAction(EProductActions.ResetProductState, (params: any = {}) => params);
