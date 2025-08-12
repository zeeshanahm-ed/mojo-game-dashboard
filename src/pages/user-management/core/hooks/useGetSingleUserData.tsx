import { useQuery } from 'react-query';
import { getSingleUserData } from '../_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useGetSingleUserData = (id: string) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_SINGLE_USER, , id], () => getSingleUserData(id),
    );
    return { userData: data?.data?.data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useGetSingleUserData;
