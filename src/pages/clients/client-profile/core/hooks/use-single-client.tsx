import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getSingleClientData } from '../_requests';

const useSingleClientData = (clientId: string | undefined) => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
    [QUERIES_KEYS.SINGLE_CLIENT, clientId],
    () => getSingleClientData(clientId),
    {
      enabled: !!clientId, // Skip the query if clientId is falsy (undefined or null)
      cacheTime: 1,        // Disable cache by setting cacheTime to 0
    }
  );

  return { singleClientData: data?.data ,error, isLoading, isError, isSuccess, clientInfoRefecth:refetch };
};

export default useSingleClientData;

