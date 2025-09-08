import { useQuery } from 'react-query';
import { ServicesStatusDataParams } from '../_modals';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getDashboardServiceStatusData } from '../_request';

const useDashboardServicesStatusData = (params: ServicesStatusDataParams) => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
    [QUERIES_KEYS.GET_DASHBOARD_DATA, params],
    () => getDashboardServiceStatusData(params),
    {
      cacheTime: 1,
      staleTime: 0,
    }
  );

  return { ServicesStatusData: data?.data?.serviceStatusTable, error, isLoading, isError, isSuccess, refetch };
};

export default useDashboardServicesStatusData;
