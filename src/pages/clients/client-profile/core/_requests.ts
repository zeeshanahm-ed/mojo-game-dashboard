import api from 'services/api/api';
import { SingleClientData } from './_modals';

const CLIENT_URL = '/clients';

export function getSingleClientData(id: any) {
  return api.get<SingleClientData>(`${CLIENT_URL}/${id}`).then((response) => response);
}
