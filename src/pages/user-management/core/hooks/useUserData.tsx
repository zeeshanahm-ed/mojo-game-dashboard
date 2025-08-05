import { useQuery } from 'react-query';
import { getUserData } from '../_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { UserDataParams } from '../_modals';

const useUserData = (params:UserDataParams) => {
  const { data, error, isLoading, isError, isSuccess, refetch  } = useQuery([QUERIES_KEYS.GET_USERS, , params], () => getUserData(params),
);
  return { userData: data?.data, error, isLoading, isError, isSuccess , refetch};
};

export default useUserData;
