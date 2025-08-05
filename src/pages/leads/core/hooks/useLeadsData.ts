import { useQuery } from 'react-query';
import { getLeadsData } from '../_requests';
import { LeadsDataParams } from '../_modals';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useLeadsData = (params: LeadsDataParams) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_LEADS, , params], () => getLeadsData(params),
        {
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { leadData: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useLeadsData;