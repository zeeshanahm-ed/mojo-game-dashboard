import { useQuery } from 'react-query';
import { getClientData } from '../_requests';
import { ClientDataParams } from '../_modals';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useClientData = (params:ClientDataParams) => {
  const { data, error, isLoading, isError, isSuccess,refetch  } = useQuery([QUERIES_KEYS.GET_CLIENTS, , params], () => getClientData(params),
  {
    cacheTime: 1,
    staleTime: 0,
  }
);

  return { clientData: data?.data, error, isLoading, isError, isSuccess , refetch};
};

export default useClientData;
