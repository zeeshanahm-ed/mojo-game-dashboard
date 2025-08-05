import api from 'services/api/api';

const WARNINGS_URL = '/warnings';

export function getWarningsData(params: any) {
    return api.get<any>(WARNINGS_URL, { params }).then((response) => response);
}
export function deleteWarnings(ids: any) {
    return api.delete(`${WARNINGS_URL}`, { data: ids }).then((response) => response);
}
export function updateWarningData(data: any) {
    return api.patch(`${WARNINGS_URL}`, data).then((response) => response);
}