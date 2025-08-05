import api from 'services/api/api';




const ANALYTICS_URL = '/dashboard/analytics';


export function getAnalyticsData(params:any) {
    return api.get(ANALYTICS_URL, { params }).then((response) => response);
  }
