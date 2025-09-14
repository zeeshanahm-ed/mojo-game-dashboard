import api from 'services/api/api';


export function getDashboardStatistics(params: any) {
  return api.get("/statistics/dashboard", { params }).then((response) => response.data);
}