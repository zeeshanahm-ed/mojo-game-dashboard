import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getLeadById } from '../_requests';

const useGetLeadById = (id?: string) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
        [QUERIES_KEYS.GET_LEADS_BY_ID, id],
        () => getLeadById(id),
        {
            cacheTime: 1,
            staleTime: 0,
            enabled: !!id,
        }
    );

    return {
        leadData: data?.data,
        error,
        isLoading,
        isError,
        isSuccess,
        refetchLeadData: refetch
    };
};

export default useGetLeadById;