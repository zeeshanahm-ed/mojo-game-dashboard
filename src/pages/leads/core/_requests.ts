import api from 'services/api/api';
import { LeadsData } from './_modals';
const LEADS_URL = '/lead';

export function getLeadsData(params: any) {
    return api.get<any>(LEADS_URL, { params }).then((response) => response);
}

export function createLead(data: LeadsData) {
    return api.post(`${LEADS_URL}`, data).then((response) => response);
}
export function updateLead(id: string, data: LeadsData) {
    return api.patch(`${LEADS_URL}/${id}`, data).then((response) => response);
}
export function deleteLead(id: string) {
    return api.delete(`${LEADS_URL}/${id}`).then((response) => response);
}

export function getLeadById(id: any) {
    return api.get<any>(`${LEADS_URL}/${id}`).then((response) => response);
}
