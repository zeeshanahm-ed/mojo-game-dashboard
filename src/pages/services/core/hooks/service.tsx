import { useQuery } from 'react-query';
import { serviceDataParams } from '../_modals';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getServiceData, getServiceDataByClientId, getServiceDataById } from '../_requests';

const useServiceData = (params: serviceDataParams | null, id?: string, singleClientService?: any) => {

  const getQueryKey = (
    id?: string,
    singleClientService?: any,
    params?: serviceDataParams | null
  ) => {
    if (id && singleClientService) {
      return [
        QUERIES_KEYS.GET_SERVICE_SINGLE_CLIENT,
        id,
        singleClientService,
        params?.search,
        params?.status,
        params?.clientId,
        params?.page,
        params?.sort
      ];
    }

    if (id) {
      return [QUERIES_KEYS.GET_SERVICE, id];
    }

    return [
      QUERIES_KEYS.GET_SERVICE,
      params?.search,
      params?.status,
      params?.clientId,
      params?.page,
      params?.sort
    ];
  };


  const queryKey = getQueryKey(id, singleClientService, params);;


  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery<any>(
    queryKey,
    async () => {
      if (id && singleClientService) {
        const response = await getServiceDataByClientId(id, params);
        return response;
      } else if (id) {
        const response = await getServiceDataById(id);
        return response.data;
      } else {
        const response = await getServiceData(params);
        return response.data;
      }
    },
    {
      enabled: !!(id || params || singleClientService),
      cacheTime: 1,
      staleTime: 0,
    }
  );

  return { serviceData: data, error, isLoading, isError, isSuccess, refetch };
};

export default useServiceData;
