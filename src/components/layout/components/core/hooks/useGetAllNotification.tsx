import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getAllNotifications } from '../_request';

const useGetAllNotification = (params: any) => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
    [QUERIES_KEYS.GET_ALL_NOTIS, params],
    () => getAllNotifications(params),

  );

  return {
    allNotifications: data?.data,
    error,
    isLoadingCase: isLoading,
    isError,
    isSuccess,
    refetchNotifications: refetch
  };
};

export default useGetAllNotification;
