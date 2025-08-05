import { useQuery } from 'react-query';
import { BillingDataParams } from '../_modals';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getBillingData } from '../_request';

const useBillingData = (params: BillingDataParams) => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
    [QUERIES_KEYS.GET_BILLING, params],
    () => getBillingData(params),
    {
      cacheTime: 1,    // Disable caching
      staleTime: 0,    // Consider data stale immediately
    }
  );

  const BillingData = data?.invoices?.data?.map((item: any) => ({
    date: item?.createdAt,
    number: item?.invoiceNumber || 'N/A',
    service: item?.case?.caseType?.name || 'N/A',
    client: item?.client?.basicInformation?.clientName || 'N/A',
    case: item?.case || 'N/A',
    user: item?.addedBy?.name || 'N/A',
    amount: item?.amount,
    status: item?.status,
  })) || [];

  const billingPagination = {
    currentPage: data?.invoices?.currentPage,
    totalItems: data?.invoices?.totalItems,
    pageSize: data?.invoices?.pageSize,
    totalPages: data?.invoices?.totalPages,
  };
 const invoices =  data;
  return { BillingData, billingPagination,invoices, error, isLoading, isError, isSuccess, refetch };
};

export default useBillingData;
