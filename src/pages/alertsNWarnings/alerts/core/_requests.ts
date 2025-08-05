import api from 'services/api/api';

const ALERTS_URL = '/alerts';

export function getAlertsData(params: any) {
    return api.get<any>(ALERTS_URL, { params }).then((response) => response);
}
export function deleteAlerts(ids: any) {
    return api.delete(`${ALERTS_URL}`, { data: ids, }).then((response) => response);
}
export function updateAlertData(data: any) {
    return api.patch(`${ALERTS_URL}`, data).then((response) => response);
}
