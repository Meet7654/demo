import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";
import {AddProductComponent} from "./home/add-product/add-product.component";
import {AddOrderComponent} from "./home/add-order/add-order.component";
import {HomeComponent} from "./home/home.component";
import {RouteGuardGuard} from "./guards/route-guard.guard";
import {OrderListComponent} from "./home/order-list/order-list.component";


const routes: Routes = [
  { path: '', redirectTo : 'register', pathMatch:'full' },
  { path:'register', component: RegisterComponent},
  { path:'login', component: LoginComponent},
  { path:'add-product',canActivate: [RouteGuardGuard],component: AddProductComponent},
  { path:'add-order', component: AddOrderComponent},
  { path:'order-list', component: OrderListComponent},
  { path:'home', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
