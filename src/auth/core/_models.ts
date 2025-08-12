export interface IAuthModel {
  data: any;
  api_token: any;
}

export interface IUserModel {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female" | string;
  email: string;
  phoneNumber: string;
  imageUrl: string | null;
  role: string;
  status: string;
  creditsBalance: number;
  gamesPlayed: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISignInForm {
  email: string;
  password: string;
}
export interface IVerifyOTP {
  email: string;
  password: string;
}
export interface ISignUpForm {
  phoneNumber: number | string;
  password: string;
  name?: string;
  referralCode?: string;
}

export interface IForgotPasswordForm {
  email: string | null;
}

export interface IVerifyOtpRequestBody {
  email: string | null;
  otp: string;
}

export interface IChangePasswordForm {
  newPassword: string;
  confirmPassword: string;
  otp: string | null;
  email: string | null;
}
