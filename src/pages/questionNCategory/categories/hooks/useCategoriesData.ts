import { useQuery } from 'react-query';
import { getCategoriesData } from '../core/_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useCategoriesData = (params: any) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_CATEGORIES, , params], () => getCategoriesData(params),
        {
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { categoriesData: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useCategoriesData;