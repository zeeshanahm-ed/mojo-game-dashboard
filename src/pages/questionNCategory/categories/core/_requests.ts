import api from 'services/api/api';

const CATEGORY_URL = '/category';

export function getCategoriesData(params: any) {
    return api.get(`${CATEGORY_URL}/all`, { params }).then((response) => response.data);
}
export function getAllCategoriesDataForDropDown() {
    return api.get(`${CATEGORY_URL}/dropdown`).then((response) => response.data);
}
export function deleteCategory(id: string) {
    return api.delete(`${CATEGORY_URL}/${id}`).then((response) => response.data);
}
export function updateCategoryData(data: any, id: string) {
    return api.patch(`${CATEGORY_URL}/${id}`, data).then((response) => response.data);
}
export function addCategory(data: any) {
    return api.post(`${CATEGORY_URL}/create`, data).then((response) => response.data);
}
