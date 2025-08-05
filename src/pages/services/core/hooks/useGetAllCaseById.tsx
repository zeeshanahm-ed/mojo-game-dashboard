import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getCaseDocumentById } from '../_requests';

const useGetAllCaseById = (id?: string) => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
    [QUERIES_KEYS.GET_ALL_CASE_BY_ID, id], 
    () => getCaseDocumentById(id), 
    {
      cacheTime: 1,  // Disable caching
      staleTime: 0,  // Mark data as stale immediately
      enabled: !!id,  // Only run if `id` exists
    }
  );

  return { 
    caseAllDocumentData: data?.data, 
    error, 
    isLoadingCase: isLoading, 
    isError, 
    isSuccess, 
    refetchCaseData: refetch 
  };
};

export default useGetAllCaseById;
