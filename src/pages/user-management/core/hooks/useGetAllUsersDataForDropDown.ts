import { useQuery } from 'react-query';
import { getAllUsersDataForDropDown, } from '../_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useGetAllUsersDataForDropDown = () => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_ALL_USERS,], () => getAllUsersDataForDropDown(),
        {
            keepPreviousData: true,
            cacheTime: 0,
            staleTime: 0,
        }
    );

    return { allUsersData: data?.data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useGetAllUsersDataForDropDown;