import api from 'services/api/api';
import { BillingData } from './_modals';

const BILLING_URL = '/cases-bills';

export function getBillingData(params: any) {
  return api.get<BillingData>(BILLING_URL, { params }).then((response) => response.data);
}
