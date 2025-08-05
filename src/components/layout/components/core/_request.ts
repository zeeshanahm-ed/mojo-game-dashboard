import api from "services/api/api";

const NOTIFICATION = '/notification'
const SINGLE_NOTIFICATION = 'notification/read-one'
export function getAllNotifications(params: any) {
  return api.get<any>(NOTIFICATION, { params }).then((response) => response);
}

export function updateNotificationAssign() {
  return api.patch(`${NOTIFICATION}`).then((response) => response);
}
export function updateSingleNotification(id: string) {
  return api.patch(`${SINGLE_NOTIFICATION}/${id}`).then((response) => response);
}
export function deleteSingleNotification(id: string) {
  return api.delete(`${NOTIFICATION}/${id}`).then((response) => response);
}