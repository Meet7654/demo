
import {
  AddOrder,
  AddOrderSuccess,
  AddOrderError,
  ResetOrderState, ListOrder, ListOrderSuccess, ListOrderError

} from "./order.actions";
import {Action, createReducer, on} from "@ngrx/store";
import {initialOrderState} from "./order.state";
import {ProductList, ProductListError, ProductListSuccess} from "../product/product.actions";

const generateReducer = createReducer(initialOrderState,
  on(AddOrder, (state) => ({
    ...state,
    order: null,
    success: '',
    error: ''
  })),
  on(AddOrderSuccess, (state, {order}) => ({
    ...state,
    order,
    success: 'Order Added Successfully',
    error: ''
  })),
  on(AddOrderError, (state, {error}) => ({
    ...state,
    order: null,
    success: '',
    error
  })),

  on(ListOrder, (state) => ({
    ...state,
    product: null,
    allOrders: [],
    success: '',
    error: ''
  })),
  on(ListOrderSuccess, (state, allOrders) => ({
    ...state,
    product: null,
    allOrders,
    success: 'Order Listed Successfully',
    error: ''
  })),
  on(ListOrderError, (state, {error}) => ({
    ...state,
    product: null,
    allOrders: [],
    success: '',
    error
  })),

  on(ResetOrderState, (state, {params}) => ({
    ...state,
    ...params
  })),
);

export function orderReducer(state = initialOrderState, action: Action) {
  return generateReducer(state, action);
}

