import {User} from "../../models/user";

export interface IAuthenticationState {
  user: any;
  login : any;
  success: string;
  error: string;
}

export const initialAuthenticationState: IAuthenticationState = {
  user: JSON.parse(localStorage.getItem('currentUser')) || null,
  login : JSON.parse(localStorage.getItem('currentUser')) || null,
  success: '',
  error: ''
};
