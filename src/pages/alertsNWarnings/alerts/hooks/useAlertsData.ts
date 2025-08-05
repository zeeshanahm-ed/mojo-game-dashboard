import { useQuery } from 'react-query';
import { getAlertsData } from '../core/_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useAlertsData = (params: any) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_ALERTS, , params], () => getAlertsData(params),
        {
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { alertData: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useAlertsData;