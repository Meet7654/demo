
import {
  RegisterError,
  RegisterSuccess,
  RegisterUser,
  ResetAuthState, VerifyLogin, VerifyLoginError, VerifyLoginSuccess

} from "./authentication.actions";
import {initialAuthenticationState} from "./authentication.state";
import {Action, createReducer, on} from "@ngrx/store";

const generateReducer = createReducer(initialAuthenticationState,
  on(RegisterUser, (state) => ({
    ...state,
    user: null,
    success: '',
    error: ''
  })),
  on(RegisterSuccess, (state, {user}) => ({
    ...state,
    user,
    success: 'Registered Successfully',
    error: ''
  })),
  on(RegisterError, (state, {error}) => ({
    ...state,
    user: null,
    success: '',
    error
  })),

  on(ResetAuthState, (state, {params}) => ({
    ...state,
    ...params
  })),

  on(VerifyLogin, (state) => ({
    ...state,
    user: null,
    users: null,
    success: '',
    error: ''
  })),
  on(VerifyLoginSuccess, (state, {users}) => ({
    ...state,
    user:null,
    users,
    success: 'Login verified successfully',
    error: ''
  })),
  on(VerifyLoginError, (state, {error}) => ({
    ...state,
    user:null,
    users: null,
    success: '',
    error
  })),
);

export function authenticationReducer(state = initialAuthenticationState, action: Action) {
  return generateReducer(state, action);
}

