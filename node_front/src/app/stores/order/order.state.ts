import {Order} from "../../models/order";

export interface IOrderState {
  order: any;
  allOrders: any;
  success: string;
  error: string;
}

export const initialOrderState: IOrderState = {
  order: null,
  allOrders: [],
  success: '',
  error: ''
};
