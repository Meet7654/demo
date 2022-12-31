import { Component, OnInit } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AddProduct, ResetProductState} from "../../stores/product/product.actions";
import {select, Store} from "@ngrx/store";
import {IProductState} from "../../stores/product/product.state";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {getError, getProduct, getSuccess} from "../../stores/product/product.selectors";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  url: any; //Angular 11, for stricter type
  msg = "";
  addProduct: FormGroup;
  submitted = false;
  unSubscriber = new Subject();
  selectedImage : any;
  constructor(
              private router: Router,
              private toastrService: ToastrService,
              private productStore: Store<IProductState>) {
    this.addProduct = new FormGroup({
      name: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      image: new FormControl(""),
      quantity: new FormControl("", [Validators.required])
    });
    this.productStore.dispatch(ResetProductState({params: {user: null, otp: null, error: ''}}));
    this.subscribeStores();
  }
  subscribeStores() {
    // redirect to home if already logged in
    this.productStore.pipe(select(getProduct))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((user: any) => {
        if(user){
          this.router.navigate(['/home']);
        }
      })

    this.productStore.pipe(select(getSuccess))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(success => {
        if (success && this.submitted) {
          this.submitted = false;
          this.toastrService.success(success);
          console.log(success)
          // this.router.navigate(['/product-list']);
        }
      });

    this.productStore.pipe(select(getError))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((error: any) => {
        console.log(error)
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
  }

  submit() {
    this.submitted = true;
    if (this.addProduct.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.addProduct.value.name);
    formData.append('image', this.selectedImage);
    formData.append('price', this.addProduct.value.price);
    formData.append('quantity', this.addProduct.value.quantity);
console.log(formData)
    this.productStore.dispatch(AddProduct({body: formData, product: 'admin'}));
  }

  selectFile(event: any) {
      if(!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }
    this.selectedImage = event.target.files[0];
    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = "";
      this.url = reader.result;
    }
  }}
