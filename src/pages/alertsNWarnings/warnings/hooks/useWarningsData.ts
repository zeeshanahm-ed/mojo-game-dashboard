import { useQuery } from 'react-query';
import { getWarningsData } from '../core/_request';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useWarningsData = (params: any) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_WARNINGS, , params], () => getWarningsData(params),
        {
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { warningData: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useWarningsData;