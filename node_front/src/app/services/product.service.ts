import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseApiUrl = environment.apiUrl + 'users';

  constructor(private http:HttpService,
              private httpClient: HttpClient,
              private router: Router) {
  }

  addProduct(body: any, product: any ){
    const currentUserToken = localStorage.getItem('token');
    const headers = new HttpHeaders({'enctype': 'multipart/form-data', 'Authorization': 'Bearer ' + currentUserToken});
    return this.httpClient.post(`${this.baseApiUrl}/add-product`,
      body,
      {
        headers: headers,
        observe: 'response',
      }
    );
  }

  getProduct(params?:any){
    return this.http.get(`${this.baseApiUrl}/get-product`, params);
  }

  getProductById(product_id,params?:any){
    return this.http.get(`${this.baseApiUrl}/get-product-id/${product_id}`, params);
  }
}
