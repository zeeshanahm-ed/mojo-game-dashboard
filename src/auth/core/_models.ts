import { ID } from 'helpers/crud-helper/models';

export interface IAuthModel {
  data: any;
  api_token: any;
}

interface IAddress {
  _id: string;
}

export interface IUserModel {
  _id: ID;
  phoneNumber: string;
  weeklyPreference: string;
  balance: number;
  maxCreditLimit: number;
  role: any;
  profilePicture:any;
  email:any;
  token:any;
  addresses: IAddress[];
  createdAt: string;
  department:string;
  name:string;
  updatedAt: string;
  data: any;
}

export interface ISignInForm {
  phoneNumber: number | string;
  password: string;
}
export interface ISignUpForm {
  phoneNumber: number | string;
  password: string;
  name?: string;
  referralCode?: string;
}

export interface IForgotPasswordForm {
  phoneNumber: number | string;
}

export interface IVerifyOtpRequestBody {
  phoneNumber: number | string;
  otp: string;
}

export interface IChangePasswordForm {
  newPassword: string;
  otp: string;
  phoneNumber: number | string;
}
