
import {
  AddProduct,
  AddProductSuccess,
  AddProductError,
  ResetProductState, ProductList, ProductListError, ProductListSuccess, GetProduct, GetProductSuccess, GetProductError

} from "./product.actions";
import {initialProductState} from "./product.state";
import {Action, createReducer, on} from "@ngrx/store";

const generateReducer = createReducer(initialProductState,
  on(AddProduct, (state) => ({
    ...state,
    product: null,
    success: '',
    error: ''
  })),
  on(AddProductSuccess, (state, {product}) => ({
    ...state,
    product,
    success: 'Product Added Successfully',
    error: ''
  })),
  on(AddProductError, (state, {error}) => ({
    ...state,
    product: null,
    success: '',
    error
  })),
  on(ProductList, (state) => ({
    ...state,
    product: null,
    allProducts: [],
    success: '',
    error: ''
  })),
  on(ProductListSuccess, (state, allProducts) => ({
    ...state,
    product: null,
    allProducts,
    success: 'Product Listed Successfully',
    error: ''
  })),
  on(ProductListError, (state, {error}) => ({
    ...state,
    product: null,
    allProducts: [],
    success: '',
    error
  })),
  on(GetProduct, (state) => ({
    ...state,
    product: null,
    allProducts: [],
    success: '',
    error: ''
  })),
  on(GetProductSuccess, (state, product) => ({
    ...state,
    product,
    allProducts:[],
    success: 'Product Listed Successfully',
    error: ''
  })),
  on(GetProductError, (state, {error}) => ({
    ...state,
    product: null,
    allProducts: [],
    success: '',
    error
  })),

  on(ResetProductState, (state, {params}) => ({
    ...state,
    ...params
  })),
);

export function productReducer(state = initialProductState, action: Action) {
  return generateReducer(state, action);
}

