import {Component, OnInit, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductService} from "../services/product.service";
import {IProductState} from "../stores/product/product.state";
import {select, Store} from "@ngrx/store";
import {ProductList, ResetProductState} from "../stores/product/product.actions";
import {Subject, takeUntil} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {AuthenticationService} from "../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {getAllProduct, getError, getSuccess} from "../stores/product/product.selectors";
import {environment} from "../../environments/environment";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddOrderComponent} from "./add-order/add-order.component";
import {DataTableDirective} from "angular-datatables";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,AfterViewInit, OnDestroy {
  allProducts: any;
  dtOptions: DataTables.Settings = {};
  imgPath = environment.baseUrl + 'uploads/'
  tokenData: any;
  unSubscriber = new Subject();
  isAdmin = false;
  modelRef: any;
  productImageSrc: any;
  @ViewChild(DataTableDirective, {static:true})
  dtElement: DataTableDirective;
  ajaxCallback: any;
  private datatableInstance: DataTables.Api;
  private searchDelay;
  // dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private http: HttpClient,
              private service: ProductService,
              // public modal: NgbActiveModal,
              private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private readonly _modalService: NgbModal,
              private productStore: Store<IProductState>,
              private toastrService: ToastrService,) {
    this.productStore.dispatch(ResetProductState({params: {error: ''}}));
    // this.authenticationStore.dispatch(ResetAuthState({params: {user: null,error: ''}}));
    this.subscribeStores();
  }

  subscribeStores() {

    this.productStore.pipe(select(getAllProduct))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((allProductListData: any) => {
        if (allProductListData.product) {
          // console.log('Here Comes',allProductListData.product.count.total_product)
          this.allProducts = allProductListData.product.product;
          if (this.allProducts.image) this.productImageSrc = this.imgPath + this.allProducts.image;
          if (this.ajaxCallback) {
            this.ajaxCallback({
              recordsTotal: allProductListData.product.count.total_product,
              recordsFiltered: allProductListData.product.count.total_product,
              data: []
            });
            setTimeout(() => {
              this.datatableInstance.columns.adjust();
            }, 1);
          }
        }
      });

    this.productStore.pipe(select(getSuccess))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((success: any) => {
        if (success) {
          // this.toastrService.success(success.message);
        }
      });

    this.productStore.pipe(select(getError))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((error: any) => {
        if (error) {

        }
      });
  }

  ngOnInit(): void {
    this.datatableSettings();
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(void 0);
      });
    } else {
      this.dtTrigger.next(void 0);
    }
    this.tokenData = JSON.parse(localStorage.getItem('currentLogin'));
    if (this.tokenData.body.data.role == 'admin'){
      this.isAdmin = true;
    }

    // this.getAllProductList();
  }

  ngAfterViewInit() {
    this.dtTrigger.next(void 0);
  }
  datatableSettings() {
    const columns = [ 'id', 'name', 'image', 'price', 'quantity','updated_at'];
    this.dtOptions = {
      scrollCollapse: true,
      pagingType: 'full_numbers',
      columnDefs: [ {
        targets: [0,1,3,4,5],
        orderable: false}
      ],
      responsive: false,
      ordering: true,
      processing: true,
      pageLength: 5,
      paging: true,
      serverSide: true,
      scrollX: true,
      searching: true,
      // language: {
      //   'paginate': {
      //     'first': '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
      //     'last': '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
      //     'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      //     'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
      //   },
      // },
      drawCallback: function (setting:any) {
        const totalPages =  this.api().page.info().pages;
        if (totalPages <= 1) {
          document.querySelector('.dataTables_paginate').classList.add('d-none');
        } else {
          document.querySelector('.dataTables_paginate').classList.remove('d-none');
        }
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          this.datatableInstance = dtInstance;
          this.ajaxCallback = callback;
          const pageLength = dataTablesParameters.length;
          const pageNumber = (dataTablesParameters.start / pageLength);
          this.datatableInstance.page.len(pageLength);
          const searchBox = $('div.dataTables_filter input');
          $('div.dataTables_filter input').attr('placeholder','Search...');
          searchBox.off('keyup.DT input.DT');
          searchBox.on('keyup', () => {
            let search : any = searchBox.val();
            clearTimeout(this.searchDelay);
            this.searchDelay = setTimeout(() => {
              if (search != null) {
                this.datatableInstance.search(search).draw();
              }
              else {
               search.name.trim().toLowerCase().includes(search.trim().toLowerCase())
              }
            }, 1000);
          });
          const orderBy = {
            ...dataTablesParameters.order[0],
            column: columns[dataTablesParameters.order[0].column]
          };
          this.loadAllDiamonds(pageNumber, pageLength, '',orderBy);
        });
      },
      columns: [
        {data: null}, {data: null}, {data: null}, {data: null}, {data: null},  {data: null}
      ],
      order : [5, 'desc']
    };
  }
  private loadAllDiamonds(page_no = 0, limit, search_name = '',orderBy= {'column': 'updated_at', 'dir': 'desc'}) {
    let option: any = {includePagination: true, orderBy};

    this.productStore.dispatch(ProductList({
      params: {
        // options: JSON.stringify(option),
        page_no: page_no + 1,
        limit,
        search_name,
        orderBy: JSON.stringify(orderBy)
      }
    }));
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  // getAllProductList() {
  //   this.productStore.dispatch(ProductList());
  // }
  openTimeModel(id) {
    this.modelRef = this._modalService.open(AddOrderComponent, {
      centered: true,
      size: '',
      keyboard: true,
    });
    this.modelRef.componentInstance.product_id = id;
  }

  ngOnDestroy() {
    this.unSubscriber.next(void 0);
    // this.dtTrigger.unsubscribe();
  }


}
