import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getDashboardStatistics } from '../_request';

const useGetDashboardStatistics = (params: any) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_DASHBOARD_DATA, params], () => getDashboardStatistics(params),
        {
            keepPreviousData: true,
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { dashboardData: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useGetDashboardStatistics;