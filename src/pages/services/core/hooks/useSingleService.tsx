import { useQuery } from 'react-query';

import { serviceDataParams } from '../_modals';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getServiceDataByClientId } from '../_requests';


const useSingleService = (params: serviceDataParams, id?: any) => {
  const queryKey = id ? [QUERIES_KEYS.GET_SERVICE, id] : [QUERIES_KEYS.GET_SERVICE, params];

  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(queryKey,() => (getServiceDataByClientId(id,params)),
    {
      enabled: !!(id),
    }
  );

  return { serviceData: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useSingleService;