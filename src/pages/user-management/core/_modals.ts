import { ReactNode } from "react";

export interface UserData {
  data: any;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  isSuccess: boolean;
}

export interface GetUserDataParems {
  limit?: number;
  page?: number;
  name?: string;
  status?: string;
}

export interface User {
  password: string;
  userId: string;
  name: ReactNode;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: any;
  active: boolean;
  department: string;
  isActive: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  isLoginEnabled: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  emailVerified: boolean;
  emailVerificationToken?: number; // Optional
  emailVerificationTokenExpiresAt?: string; // Optional ISO date string
}