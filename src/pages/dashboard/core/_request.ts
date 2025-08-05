import api from 'services/api/api';


const SERVICE_STATUS_DATA = '/dashboard/service-status-table/';
const DASHBOARD_URL = '/dashboard/dashboard-summary/';


export function getDashboardServiceStatusData(params: any) {
  return api.get<any>(SERVICE_STATUS_DATA, { params }).then((response) => response);
}
export function getDashboardData(params: any) {
  return api.get<any>(DASHBOARD_URL, { params }).then((response) => response);
}

