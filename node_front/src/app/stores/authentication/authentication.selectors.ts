import {IAuthenticationState} from "./authentication.state";
import {createFeatureSelector, createSelector} from "@ngrx/store";

const selectUsers = createFeatureSelector<IAuthenticationState>('authentication');

export const getLoggedInUser = createSelector(selectUsers, (state: IAuthenticationState) => state.user);

export const getVerifyLogin = createSelector(selectUsers, (state: IAuthenticationState) => state.login);

export const getSuccess = createSelector(selectUsers, (state: IAuthenticationState) => state.success);

export const getError = createSelector(selectUsers, (state: IAuthenticationState) => state.error);


