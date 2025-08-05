// export interface ServiceData {
//     data: any;
//     currentPage: number;
//     pageSize: number;
//     totalItems: number;
//     totalPages: number;
//     isSuccess: boolean;
//   }

export interface serviceDataParams {
  limit?: number;
  page?: number;
  search?: any;
  filter?: string;
  sort?: string;
  sortDir?: string;
  status?: any;
  clientId?: string;
}

interface ClientBasicInformation {
  clientId: any;
  clientName: string;
}

interface Client {
  _id: string;
  basicInformation: ClientBasicInformation;
}

interface CaseType {
  _id: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  serviceId: string;
  _id: string;
  name: string;
  client: Client;
  clientDetails: {
    _id: string;
    name: string;
  };
  caseType: CaseType;
  status: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  assignedTo: any;
  updatedAt: string;
  isWarningGiven: boolean;
  isAlertGiven: boolean;
  isWarningOnJobSupport45Days: boolean;
  isWarningMeetingNotConducted: boolean;
  isWarningReportNotSigned: boolean;
}

export interface ServiceData {
  message: string;
  data: any;
  error: string | null;
  isSuccess: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}



interface ClientDetails {
  _id: string;
  name: string;
}

export interface SingleServiceData {
  data: any;
  _id: string;
  name: string;
  client: string;
  clientDetails: ClientDetails;
  caseType: string;
  status: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string; // You might want to use Date type if you're parsing it
  updatedAt: string; // Same as above
}
export interface ServiceDetailsProps {
  serviceData: SingleServiceData; // Use the defined interface here
  refetch: any
  section: string
}


export interface ClientInfo {
  name: any;
  _id: string;
  basicInformation: {
    clientId: any;
    clientName: string;
  };
}

export interface FormattedClient {
  _id: any;
  selectedClient: any;
  basicInformation: any;
  text: any;
  value: any;
  id: string;
  clientName: string;
  clientId: any;
}


export interface CaseDocument {
  _id: string;
  case: string;
  caseDataSubType: number;
  caseDataType: number;
  client: string;
  description: string;
  date: string;
  document: string[]; // Array of URLs (string)
  isActive: boolean;
  isDeleted: boolean;
  phase: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user?: any;
  numberOfDays?: number;
}