import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {getError, getLoggedInUser, getSuccess} from "../../stores/authentication/authentication.selectors";
import {ToastrService} from "ngx-toastr";
import {Subject, takeUntil} from "rxjs";
import {select, Store} from "@ngrx/store";
import {IAuthenticationState} from "../../stores/authentication/authentication.state";
import {RegisterUser, ResetAuthState} from "../../stores/authentication/authentication.actions";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  unSubscriber = new Subject();
  constructor(private fb: FormBuilder,
              private router: Router,
              private toastrService: ToastrService,
              private authenticationStore: Store<IAuthenticationState>) {
    this.form = new FormGroup({
      first_name: new FormControl("", [Validators.required]),
      last_name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
    this.authenticationStore.dispatch(ResetAuthState({params: {user: null, register: null, error: ''}}));
    this.subscribeStores();
  }

  subscribeStores() {
    // redirect to home if already logged in
    this.authenticationStore.pipe(select(getLoggedInUser))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((user: any) => {
        if(user){
            this.router.navigate(['/home']);
          }
      })

    this.authenticationStore.pipe(select(getSuccess))
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(success => {
        if (success && this.submitted) {
          this.submitted = false;
          this.toastrService.success(success);
          this.router.navigate(['/login']);
        }
      });

    this.authenticationStore.pipe(select(getError))
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
    if (this.form.invalid) {
      return;
    }
    this.authenticationStore.dispatch(RegisterUser({
      user: {
        first_name: this.form.value.first_name,
        last_name: this.form.value.last_name,
        email: this.form.value.email,
        password: this.form.value.password
      }
    }));
  }
}
