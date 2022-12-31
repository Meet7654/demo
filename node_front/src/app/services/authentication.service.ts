import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseApiUrl = environment.apiUrl + 'users';

  constructor(private http:HttpService, private router: Router) {
  }

  isLoggedIn(){
    return localStorage.getItem('currentUser');
  }

  register(user: any ){
    return this.http.post(`${this.baseApiUrl}/register`, user);

  }
  login(email: any , password){
    return this.http.post(`${this.baseApiUrl}/login`, {email , password});

  }

  logOut(){
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentLogin');
    this.router.navigate(['/login']);
  }
  isTokenExpired(){
    //expire time in backend
    const expiry = (JSON.parse(atob(localStorage.getItem('authToken').split('.')[1]))).exp;
    if ((Math.floor((new Date).getTime() / 1000)) >= expiry)
    {
      this.logOut();
    }
    return true;
  }

}
