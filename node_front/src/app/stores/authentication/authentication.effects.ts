import {Injectable} from '@angular/core';
import {
  RegisterError,
  RegisterSuccess,
  RegisterUser, VerifyLogin, VerifyLoginError, VerifyLoginSuccess
} from './authentication.actions';
import {IAuthenticationState} from './authentication.state';
import {catchError, map, switchMap} from 'rxjs/operators';
import {AuthenticationService} from '../../services/authentication.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {LoaderService} from "../../services/loader.service";
import {of} from "rxjs";

@Injectable()
export class AuthenticationEffects {
  constructor(
    private actions$: Actions,
    private store: Store<IAuthenticationState>,
    private authenticationService: AuthenticationService,
    private loaderService: LoaderService
  ) {
  }

  Register$ = createEffect(() => this.actions$.pipe(
    ofType(RegisterUser),
    switchMap((action) => {
      this.loaderService.show();
      return this.authenticationService.register(action.user).pipe(
        map((user: any) => {
          this.loaderService.hide();
          if (user) {
            localStorage.setItem('currentLogin', action.user.email);
            return RegisterSuccess({user});
          }
          return RegisterError({error: 'Invalid credentials'});
        }),
        catchError((error) => {
          this.loaderService.hide();
          return of(RegisterError({error: error}));
        })
      );
    })
  ));

  Login$ = createEffect(() => this.actions$.pipe(
    ofType(VerifyLogin),
    switchMap((action) => {
      this.loaderService.show();
      return this.authenticationService.login(action.user.email,action.user.password).pipe(
        map((users: any) => {
          this.loaderService.hide();
          if (users) {
            localStorage.setItem('currentLogin', JSON.stringify(users));
            localStorage.setItem('token', users.body.token);
            return VerifyLoginSuccess({users});
          }
          return VerifyLoginError({error: 'Wrong Credentials'});
    }),
        catchError((error) => {
          this.loaderService.hide();
          return of(VerifyLoginError({error: error}));
        })
      );
    })
  ));
}
