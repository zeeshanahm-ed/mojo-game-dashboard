export interface DashboardData {
  data: any;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  isSuccess: boolean;
}

export interface DashboardDataParams {
  limit: number;
  page: number;
  search: string;
}


interface ClientDetails {
  _id: string;
  name: string;
}

interface Case {
  _id: string;
  serviceId: string;
  client: string;
  clientDetails: ClientDetails;
  caseType: string;
  status: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface LatestCases {
  message: string;
  data: Case[];
}

export interface CaseCounts {
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  latestCreatedCases: LatestCases;
  latestUpdatedCases: LatestCases;
  caseTypeCounts: any;
}
export interface ServicesStatusDataParams {
  startDate: string | null;
  endDate: string | null
}