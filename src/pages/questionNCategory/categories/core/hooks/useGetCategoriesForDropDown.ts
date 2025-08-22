import { useQuery } from 'react-query';
import { getAllCategoriesDataForDropDown, } from '../_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useGetCategoriesForDropDown = () => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_ALL_CATEGORIES,], () => getAllCategoriesDataForDropDown(),
        {
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { allCategoriesData: data?.data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useGetCategoriesForDropDown;