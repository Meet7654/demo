import { Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import {Subject, takeUntil} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {select, Store} from "@ngrx/store";
import {IOrderState} from "../../stores/order/order.state";
import {ToastrService} from "ngx-toastr";
import {ListOrder, ResetOrderState} from "../../stores/order/order.actions";
import {OrderService} from "../../services/order.service";
import {getAllOrder, getError, getSuccess} from "../../stores/order/order.selectors";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  allOrders: any ;
  tokenData:any;
  unSubscriber = new Subject();
  constructor(private http: HttpClient,
              private service: OrderService,
              private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private orderStore: Store<IOrderState>,
              private toastrService: ToastrService) {
    this.orderStore.dispatch(ResetOrderState({params: {error: ''}}));
    // this.authenticationStore.dispatch(ResetAuthState({params: {user: null,error: ''}}));
    this.subscribeStores();
  }

  subscribeStores() {

    this.orderStore.pipe(select(getAllOrder))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((allOrderListData: any) => {
        if (allOrderListData) {
          this.allOrders = allOrderListData.order.user;
        }

      });

    this.orderStore.pipe(select(getSuccess))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((success: any) => {
        if (success) {
          this.toastrService.success(success.message);
        }
      });

    this.orderStore.pipe(select(getError))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((error: any) => {
        if (error) {

        }
      });
  }

  ngOnInit(): void {
    this.tokenData = JSON.parse(localStorage.getItem('currentLogin'));
    this.getAllOrderList();
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
  getAllOrderList(){
    this.orderStore.dispatch(ListOrder());
  }
}
