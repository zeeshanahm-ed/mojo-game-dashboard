import api from 'services/api/api';
import { ServiceData } from './_modals';



const SERVICE_URL = '/cases';
const SERVICE_TYPE = '/case-type';
const SERVICE_DATA = '/cases-data';
const UPLOAD_URL = '/cases/upload-media';
const BILLING_URL = '/cases-bills';
const IJPS_RESTART_URL = '/restarted-service';

export function getServiceData(params: any) {
  return api.get<ServiceData>(SERVICE_URL, { params }).then((response) => response);
}

export function getServiceDataById(id: any) {
  return api.get<ServiceData>(`${SERVICE_URL}/${id}`).then((response) => response);
}
export async function getServiceDataByClientId(id: string, params: Record<string, any> | null): Promise<ServiceData> {
  try {
    const response = await api.get<ServiceData>(`${SERVICE_URL}/byClientId/${id}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching service data:", error);
    throw error;
  }
}

export function getServiceType() {
  return api.get<ServiceData>(SERVICE_TYPE).then((response) => response);
}

export function createServiceData(data: any) {
  return api.post(`${SERVICE_URL}`, data).then((response) => response);
}

export function deleteService(id: string) {
  return api.delete(`${SERVICE_URL}/${id}`).then((response) => response);
}
export function updateServiceAssign(id: string, data: any) {
  return api.patch(`${SERVICE_URL}/${id}`, data).then((response) => response);
}

export function getPresignedUrl(data: any) {
  return api.post(`${UPLOAD_URL}`, data).then((response) => response);
}
export function createCaseData(data: any) {
  return api.post(`${SERVICE_DATA}`, data).then((response) => response);
}
export function updatePhasesCaseData(data: any, id: string) {
  return api.patch(`${SERVICE_DATA}/${id}`, data).then((response) => response);
}

export function getAllCaseDocuments() {
  return api.get<ServiceData>(SERVICE_DATA).then((response) => response);
}

export function getSingleCaseDocuments() {
  return api.get<ServiceData>(SERVICE_DATA).then((response) => response);
}
export function getCaseDocumentById(id: any) {
  return api.get<ServiceData>(`${SERVICE_DATA}/${id}`).then((response) => response);
}
export function deleteCaseDocument(ids: any) {
  return api.delete(`${SERVICE_DATA}/${ids}`).then((response) => response);
}

export function handleDeleteAllNotes(ids: any) {
  return api.delete(`${SERVICE_DATA}`, { data: ids }).then((response) => response);

}
export function updateCaseDocuments(id: string, data: any) {
  return api.patch(`${SERVICE_DATA}/${id}`, data).then((response) => response);
}

export function createBillingData(data: any) {
  return api.post(`${BILLING_URL}`, data).then((response) => response);
}
export function createRestartService(data: any) {
  return api.post(`${IJPS_RESTART_URL}`, data).then((response) => response);
}
export function getBillingCase(id: any) {
  return api.get<ServiceData>(`${BILLING_URL}/${id}`).then((response) => response);
}
export function updateBilling(id: string, data: any) {
  return api.patch(`${BILLING_URL}/${id}`, data).then((response) => response);
}
export function deleteBillingDocument(id: string) {
  return api.delete(`${BILLING_URL}/${id}`).then((response) => response);
}
export function deleteBillingAllNotes(ids: any) {
  return api.delete(`${SERVICE_DATA}`, { data: ids }).then((response) => response);
}
export function getIJPSRestartData(id: string) {
  return api.get(`${IJPS_RESTART_URL}/${id}`).then((response) => response);
}