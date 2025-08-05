export interface ClientData {
  data: any;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  isSuccess: boolean;
  status:string
}

export interface ClientDataParams {
  limit: number;
  page: number;
  search: any;
  sortDirection: string;
  status: any;
  sort: any;
  filters: any;
}

interface BasicInformation {
  clientId: string;
  clientName: string;
  guardianContactNumber: string;
  emailAddress: string;
  phoneNumber:any;
  status:string;
}

export interface Client {
  _id: string;
  createdAt: React.ReactNode;
  basicInformation?: BasicInformation;
  id: string;
  name: string;
  created: string;
  contact: string;
  email: string;
  status: string;
}

//services

export interface ClientData {
  data: any;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  isSuccess: boolean;
}
