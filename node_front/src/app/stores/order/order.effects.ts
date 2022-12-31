import {Injectable} from '@angular/core';
import {
  AddOrder,
  AddOrderSuccess,
  AddOrderError, ListOrder, ListOrderSuccess, ListOrderError
} from './order.actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {LoaderService} from "../../services/loader.service";
import {of} from "rxjs";
import {IOrderState} from "./order.state";
import {OrderService} from "../../services/order.service";
import {ProductList, ProductListError, ProductListSuccess} from "../product/product.actions";

@Injectable()
export class OrderEffects {
  constructor(
    private actions$: Actions,
    private store: Store<IOrderState>,
    private orderService: OrderService,
    private loaderService: LoaderService
  ) {
  }

  AddOrder$ = createEffect(() => this.actions$.pipe(
    ofType(AddOrder),
    switchMap((action) => {
      this.loaderService.show();
      return this.orderService.addOrder(action.order).pipe(
        map((order: any) => {
          this.loaderService.hide();
          if (order) {
            return AddOrderSuccess({order});
          }
          return AddOrderError({error: 'Invalid Credentials'});
        }),
        catchError((error) => {
          this.loaderService.hide();
          return of(AddOrderError({error: error}));
        })
      );
    })
  ));

  OrderList$ = createEffect(() => this.actions$.pipe(
    ofType(ListOrder),
    switchMap((action) => {
      this.loaderService.show();
      return this.orderService.getOrder().pipe(
        map((resp: any) => {
          this.loaderService.hide();
          if(resp.status){
            return ListOrderSuccess({order: resp.body.data});
          }
          return ListOrderError({error: 'list not found'})
        }),
        catchError(error => {
          this.loaderService.hide();
          return of(ListOrderError({error: error}));
        })
      );
    })
  ));
}
