import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getBillingCase } from '../_requests';

const useGetBillingCaseById = (id?: string) => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
    [QUERIES_KEYS.GET_BILLING_CASE, id], 
    () => getBillingCase(id), 
    {
      cacheTime: 1,  // Disable caching
      staleTime: 0,  // Mark data as stale immediately
      enabled: !!id,  // Only run if `id` exists
    }
  );

  return { 
    billingCaseDataById: data?.data, 
    error, 
    isLoadingBilling: isLoading, 
    isError, 
    isSuccess, 
    refetchBillingData: refetch 
  };
};

export default useGetBillingCaseById;
