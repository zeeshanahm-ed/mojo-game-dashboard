import api from 'services/api/api';
import { AddUserParams, ChangeRoleParams, DeleteSingleUserParams, GetUserDataParems } from './_models';



const USER_URL = '/user';

export function getAllUserData(params: GetUserDataParems) {
    return api.get(`${USER_URL}/all`, { params }).then((response) => response?.data);
};

export function deleteSingleUser(body: DeleteSingleUserParams) {
    return api.delete(`${USER_URL}/delete`, { data: body }).then((response) => response);
};

export function addMember(body: AddUserParams) {
    return api.post(`${USER_URL}/admin-create`, body).then((response) => response?.data);
};
export function updateMember(body: AddUserParams, id: string) {
    return api.patch(`${USER_URL}/admin-update/${id}`, body).then((response) => response?.data);
};
export function changeRole(role: ChangeRoleParams, id: string) {
    return api.patch(`${USER_URL}/admin-update-role/${id}`, role).then((response) => response?.data);
};



