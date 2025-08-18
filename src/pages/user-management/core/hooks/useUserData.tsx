import { useQuery } from 'react-query';
import { getUserData } from '../_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { GetUserDataParems } from '../_modals';

const useUserData = (params: GetUserDataParems) => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_USERS, params], () => getUserData(params),
  );
  return { userData: data?.data?.data?.data, pagination: data?.data?.data?.pagination, error, isLoading, isError, isSuccess, refetch };
};

export default useUserData;
