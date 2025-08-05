import api from 'services/api/api';

import { ClientData } from './_modals';

const CLIENT_URL = '/clients';
const SERVICE_URL ='/dashboard/graph'

export function getClientData(params: any) {
  return api.get<ClientData>(CLIENT_URL, { params }).then((response) => response);
}
export function serviceGraphData() {
  return api.get<any>(SERVICE_URL).then((response) => response);
}
export function createClientData(data: ClientData) {
  return api.post(`${CLIENT_URL}`, data).then((response) => response);
}

export function updateClientData(id: string, data: ClientData ) {
  return api.patch(`${CLIENT_URL}/${id}`, data).then((response) =>{
    return response});
}
export function deleteClientData(id: string) {
  return api.delete(`${CLIENT_URL}/${id}`).then((response) => response);
}
