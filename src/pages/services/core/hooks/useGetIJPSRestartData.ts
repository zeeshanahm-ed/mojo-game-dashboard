import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getIJPSRestartData } from '../_requests';

const useGetIJPSRestartData = (id: string) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_IJPS_RESTART_DATA, , id], () => getIJPSRestartData(id),
        {
            enabled: !!id,
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { IJP_Date: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useGetIJPSRestartData;