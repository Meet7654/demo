import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {AuthenticationService} from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private toastrService:ToastrService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot){
    let user = JSON.parse(localStorage.getItem('currentLogin'));
    if(user){
      if(user.body.data.role == 'admin'){
        return true;
      } else {
        this.toastrService.error('Unauthorized user ')
      }
    }
    this.authService.logOut();
    return false;
  }
}
