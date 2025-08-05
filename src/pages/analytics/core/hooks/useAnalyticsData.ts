import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getAnalyticsData } from '../_request';

const useAnalyticsData = (params: any) => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
    [QUERIES_KEYS.GET_ANALYTICS, params],
    () => getAnalyticsData(params),
    {
      cacheTime: 1,
      staleTime: 0,
    }
  );

  return { AnalyticsData: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useAnalyticsData;
