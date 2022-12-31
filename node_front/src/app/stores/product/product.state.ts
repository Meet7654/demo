import {Product} from "../../models/product";

export interface IProductState {
  product: any;
  allProducts: any;
  success: string;
  error: string;
}

export const initialProductState: IProductState = {
  product: null,
  allProducts: [],
  success: '',
  error: ''
};
