import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseApiUrl = environment.apiUrl + 'users';

  constructor(private http:HttpService,
              private router: Router) {
  }

  addOrder(order: any ){
    return this.http.post(`${this.baseApiUrl}/add-order`, order);
  }

  getOrder(params?:any){
    return this.http.get(`${this.baseApiUrl}/get-order`, params);
  }
}
