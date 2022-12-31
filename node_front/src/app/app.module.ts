import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './Auth/register/register.component';
import { LoginComponent } from './Auth/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { StoreModule } from '@ngrx/store';
import {authenticationReducer} from "./stores/authentication/authentication.reducer";
import { EffectsModule } from "@ngrx/effects";
import { AuthenticationEffects } from "./stores/authentication/authentication.effects";
import {HttpClientModule} from "@angular/common/http";
import {ToastNoAnimationModule, ToastrModule} from "ngx-toastr";
import { AddProductComponent } from './home/add-product/add-product.component';
import { OrderListComponent } from './home/order-list/order-list.component';
import { AddOrderComponent } from './home/add-order/add-order.component';
import {productReducer} from "./stores/product/product.reducer";
import {ProductEffects} from "./stores/product/product.effects";
import {orderReducer} from "./stores/order/order.reducer";
import {OrderEffects} from "./stores/order/order.effects";
import { HomeComponent } from './home/home.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    AddProductComponent,
    OrderListComponent,
    AddOrderComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    ToastNoAnimationModule.forRoot(),
    StoreModule.forRoot({ authentication: authenticationReducer , product: productReducer, order: orderReducer}, ),
    EffectsModule.forRoot([AuthenticationEffects,ProductEffects,OrderEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
