import {User} from "../../models/user";
import {createAction, props} from "@ngrx/store";

enum EAuthenticationActions {
  RegisterUser = '[Authentication] Register User',
  RegisterSuccess = '[Authentication] Register Success',
  RegisterError = '[Authentication] Register Error',

  VerifyLogin = '[Authentication] Verify Login',
  VerifyLoginSuccess = '[Authentication] Verify Login Success',
  VerifyLoginError = '[Authentication] Verify Login Error',

  ResetAuthState = '[Authentication] Reset Auth State',
}

export const RegisterUser = createAction(EAuthenticationActions.RegisterUser, props<{ user: any }>());
export const RegisterSuccess = createAction(EAuthenticationActions.RegisterSuccess, props<{ user: User }>());
export const RegisterError = createAction(EAuthenticationActions.RegisterError, props<{ error: string }>());


export const VerifyLogin = createAction(EAuthenticationActions.VerifyLogin, props<{ user: any}>());
export const VerifyLoginSuccess = createAction(EAuthenticationActions.VerifyLoginSuccess, props<{ users: User }>());
export const VerifyLoginError = createAction(EAuthenticationActions.VerifyLoginError, props<{ error: string }>());

export const ResetAuthState = createAction(EAuthenticationActions.ResetAuthState, (params: any = {}) => params);
