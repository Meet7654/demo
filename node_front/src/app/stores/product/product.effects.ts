import {Injectable} from '@angular/core';
import {
  AddProduct,
  AddProductSuccess,
  AddProductError, ProductList, ProductListSuccess, ProductListError, GetProduct, GetProductSuccess, GetProductError
} from './product.actions';
import {IProductState} from './product.state';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {ProductService} from '../../services/product.service'
import {LoaderService} from "../../services/loader.service";
import {of} from "rxjs";

@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private store: Store<IProductState>,
    private productService: ProductService,
    private loaderService: LoaderService
  ) {
  }

  AddProduct$ = createEffect(() => this.actions$.pipe(
    ofType(AddProduct),
    switchMap((action) => {
      this.loaderService.show();
      return this.productService.addProduct(action.body, action.product).pipe(
        map((product: any) => {
          this.loaderService.hide();
          if (product) {
            return AddProductSuccess({product});
          }
          return AddProductError({error: 'Invalid Credentials'});
        }),
        catchError((error) => {
          this.loaderService.hide();
          return of(AddProductError({error: error}));
        })
      );
    })
  ));

  ProductList$ = createEffect(() => this.actions$.pipe(
    ofType(ProductList),
    switchMap((action) => {
      this.loaderService.show();
      return this.productService.getProduct(action.params).pipe(
        map((resp: any) => {
          this.loaderService.hide();
          if(resp.status){
            return ProductListSuccess({product: resp.body.data});
          }
          return ProductListError({error: 'list not found'})
        }),
        catchError(error => {
          this.loaderService.hide();
          return of(ProductListError({error: error}));
        })
      );
    })
  ));

  ProductListById$ = createEffect(() => this.actions$.pipe(
    ofType(GetProduct),
    switchMap((action) => {
      this.loaderService.show();
      return this.productService.getProductById(action.product_id).pipe(
        map((resp: any) => {
          this.loaderService.hide();
          if(resp.status){
            return GetProductSuccess({product: resp.body.data});
          }
          return GetProductError({error: 'list not found'})
        }),
        catchError(error => {
          this.loaderService.hide();
          return of(GetProductError({error: error}));
        })
      );
    })
  ));
}
