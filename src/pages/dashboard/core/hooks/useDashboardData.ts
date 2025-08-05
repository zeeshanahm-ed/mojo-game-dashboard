import { useQuery } from 'react-query';
import { ServicesStatusDataParams } from '../_modals';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getDashboardData } from '../_request';

const useDashboardData = (params: ServicesStatusDataParams) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
        [QUERIES_KEYS.GET_DASHBOARD_SERVICES_COUNT, params],
        () => getDashboardData(params),
        {
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { DashboardData: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useDashboardData;
