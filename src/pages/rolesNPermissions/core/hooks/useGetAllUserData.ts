import { useQuery } from 'react-query';
import { getAllUserData } from '../_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { GetUserDataParems } from '../_models';

const useGetAllUserData = (params: GetUserDataParems) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_ADMIN_USERS, , params], () => getAllUserData(params),
    );
    return { userData: data?.data?.data, pagination: data?.data?.pagination, error, isLoading, isError, isSuccess, refetch };
};

export default useGetAllUserData;
