import api from 'services/api/api';
import { StandardServiceTemplate, TemplateData } from './_modals';


const TEMPLATE_URL = '/service-templates';

export function getTemplateData(params: any) {
  return api.get<TemplateData>(TEMPLATE_URL, { params }).then((response) => response?.data);
}
export function createTemplate(data: StandardServiceTemplate) {
  return api.post(`${TEMPLATE_URL}`, data).then((response) => response);
}
export function deleteTemplate(id: any) {
  return api.delete(`${TEMPLATE_URL}/${id}`).then((response) => response);
}



