import { useQuery } from 'react-query';
import { getServiceType } from '../_requests';

const useServiceType = () => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
    'serviceType', 
    getServiceType 
  );

  return { serviceTypeData: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useServiceType;