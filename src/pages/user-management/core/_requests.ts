import api from 'services/api/api';
import { UserData } from './_modals';



const USER_URL = '/users';
const UPDATE_PASSWORD ='/users/update-password';

export function getUserData(params: any) {
  return api.get<UserData>(USER_URL, { params }).then((response) => response);
}
export function updateUser(id: string, data: any) {
  return api.patch(`${USER_URL}/${id}`, data).then((response) => response);
}
export function updatePassCode( data: any) {
  return api.patch(`${UPDATE_PASSWORD}`, data).then((response) => response);
}



