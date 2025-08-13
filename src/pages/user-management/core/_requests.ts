import api from 'services/api/api';
import { ChangeStatusParams, GetUserDataParems } from './_modals';



const USER_URL = '/user';

export function getUserData(params: GetUserDataParems) {
  return api.get<any>(`${USER_URL}/all`, { params }).then((response) => response);
};
export function getSingleUserData(id: string) {
  return api.get<any>(`${USER_URL}/${id}`).then((response) => response);
};
export function changeUserStatus(body: ChangeStatusParams) {
  return api.patch(`${USER_URL}/update-status`, body).then((response) => response?.data);
};


