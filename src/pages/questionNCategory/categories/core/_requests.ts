import api from 'services/api/api';

const CATEGORY_URL = '/categories';

export function getCategoriesData(params: any) {
    return api.get<any>(CATEGORY_URL, { params }).then((response) => response);
}
export function deleteCategory(ids: any) {
    return api.delete(`${CATEGORY_URL}`, { data: ids, }).then((response) => response);
}
export function updateCategoryData(data: any) {
    return api.patch(`${CATEGORY_URL}`, data).then((response) => response);
}
