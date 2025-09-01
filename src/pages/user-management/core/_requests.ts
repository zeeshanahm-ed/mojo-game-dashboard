import api from 'services/api/api';
import { ChangeStatusParams, GetUserDataParems } from './_modals';



const USER_URL = '/user';

export function getUserData(params: GetUserDataParems) {
  return api.get(`${USER_URL}/all`, { params }).then((response) => response);
};
export function getAllUsersDataForDropDown() {
  return api.get(`${USER_URL}/all-users/dropdown`, {}).then((response) => response.data);
};
export function getSingleUserData(id: string) {
  return api.get(`${USER_URL}/${id}`).then((response) => response);
};
export function changeUserStatus(body: ChangeStatusParams) {
  return api.patch(`${USER_URL}/update-status`, body).then((response) => response?.data);
};


