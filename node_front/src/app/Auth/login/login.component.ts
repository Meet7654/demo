import { Component, OnInit } from '@angular/core';
import {RegisterUser, ResetAuthState, VerifyLogin} from "../../stores/authentication/authentication.actions";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthenticationState} from "../../stores/authentication/authentication.state";
import {select, Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {getError, getSuccess, getVerifyLogin} from "../../stores/authentication/authentication.selectors";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  submitted = false;
  unSubscriber = new Subject();
  login: FormGroup;
  tokenData:any;
  constructor(private router: Router,
              private toastrService: ToastrService,
              private authService: AuthenticationService,
              private authenticationStore: Store<IAuthenticationState>) {
    this.login = new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
    this.authenticationStore.dispatch(ResetAuthState({params: {user: null, login: null, error: ''}}));
    this.subscribeStores();
  }

  ngOnInit(): void {
  }
  subscribeStores() {

    this.authenticationStore.pipe(select(getVerifyLogin))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((user: any) => {
        if (user) {
          if (this.submitted) {
            // console.log(user)
            // if (user.data.role === 'admin') {
            //   this.router.navigate(['/admin/home']);
            // }
            // if (user.data.role === 'user') {
            //   this.router.navigate(['/user/home']);
            // }
            this.toastrService.success(user.message);
          }

        }
      });

    this.authenticationStore.pipe(select(getSuccess))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(success => {
        if (success && this.submitted) {
          this.submitted = false;
          this.toastrService.success(success);
          this.router.navigate(['/home']);
          this.tokenData = JSON.parse(localStorage.getItem('currentLogin'));
        }
      });

    this.authenticationStore.pipe(select(getError))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((error: any) => {
        if (error) {
          if (error.message) {
            this.toastrService.error('Connection Refused')
          }
        }
      });
  }


  submit() {
    this.submitted = true;
    this.authenticationStore.dispatch(VerifyLogin({
      user: {
        email: this.login.value.email,
        password: this.login.value.password
      }
    }));
  }
}
