import api from 'services/api/api';
import authApi from 'services/api/authApi';

import { IAuthModel, ISignInForm, ISignUpForm } from './_models';

const LOGIN_URL = '/auth/login';
const REGISTER_URL = '/auth/signup';
const FORGOT_PASSWORD_URL='/auth/forgot-password';
const VERIFY_OTP='/auth/verify-email';
const VERIFY_TOKEN_URL = '/auth/verify-token';
const RESET_PASS_CODE = '/auth/reset-password';

export function login(body: ISignInForm) {
  return api.post<IAuthModel>(LOGIN_URL, body);
}

export function signUp(body: ISignUpForm) {
  return api.post<IAuthModel>(REGISTER_URL, body);
}
export function forgotPassCode(body: any) {
  return api.post<IAuthModel>(FORGOT_PASSWORD_URL, body);
}
export function verifyOtp(body: any) {
  return api.post<IAuthModel>(VERIFY_OTP, body);
}

export function resetPassword(body: any) {
  return api.post<IAuthModel>(RESET_PASS_CODE, body);
}
export function getUserByToken(token: string) {
  return authApi.post(
    VERIFY_TOKEN_URL,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
