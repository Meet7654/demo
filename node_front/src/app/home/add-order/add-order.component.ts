import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {select, Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {AddOrder, ResetOrderState} from 'src/app/stores/order/order.actions';
import {IOrderState} from "../../stores/order/order.state";
import {getError, getOrder, getSuccess} from "../../stores/order/order.selectors";
import {GetProduct} from "../../stores/product/product.actions";
import {getProduct} from "../../stores/product/product.selectors";
import {IProductState} from "../../stores/product/product.state";
import {environment} from "../../../environments/environment";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-order-add',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {

  imgPath = environment.baseUrl + 'uploads/'
  product :any;
  user :any;
  submitted = false;
  unSubscriber = new Subject();
  modalRef: any;
  @Input() product_id;
  productImageSrc: any;
  quantity: any = 1;
  constructor(private router: Router,
              private toastrService: ToastrService,
              private orderStore: Store<IOrderState>,
              private modalService: NgbActiveModal,
              private productStore: Store<IProductState>
  ) {
    this.orderStore.dispatch(ResetOrderState({params: {user: null,login: null, error: ''}}));
    this.subscribeStores();
  }

  subscribeStores() {

    this.productStore.pipe(select(getProduct))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((allProductListData: any) => {
        if (allProductListData) {
          this.product = allProductListData.product;
          if (this.product.image) this.productImageSrc = this.imgPath + this.product.image;
        }
      });

    this.orderStore.pipe(select(getOrder))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((user: any) => {
        if (user) {
          this.user = user;
          this.router.navigate(['/home']);
        }
      });

    this.orderStore.pipe(select(getSuccess))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(success => {
        if (success && this.submitted) {
          this.submitted = false;
          this.toastrService.success(success);
          this.router.navigate(['/home']);
          this.modalService.close();
        }
      });

    this.orderStore.pipe(select(getError))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((error: any) => {
        if (error){
          if(error.error.message && this.submitted){
            this.toastrService.error(error.error.message)
            this.submitted = false;
          } else{
            this.toastrService.error('Connection Refused');
            this.submitted = false;
          }
        }
      });
  }
  ngOnInit(): void {
    this.productStore.dispatch(GetProduct({product_id:this.product_id}));
  }
  submit() {
    this.submitted = true;

    this.orderStore.dispatch(AddOrder({
      order:{
        // user_id : this.user_id,
        product_id : this.product.id,
        product_quantity : this.quantity,
        total_price : this.product.price * this.quantity
      }
    }));
  }

  addQuantity(quantity) {
    console.log(quantity)
    if (this.product.quantity > this.quantity){
      this.quantity += 1;
    }
    else {
      console.log('Invalid Quantity')
      this.toastrService.error("Can't  Order Quantity more than in stock");
    }
  }
  removeQuantity(quantity) {
    if (this.quantity>1){
      this.quantity -= 1;
    }
  }
}
