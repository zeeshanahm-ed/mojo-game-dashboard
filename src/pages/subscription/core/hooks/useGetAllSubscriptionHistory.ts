import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getSubscriptionHistory } from '../_requesta';

const useGetAllSubscriptionHistory = (params: any) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_SUBSCRIPTION_DATA, , params], () => getSubscriptionHistory(params),
        {
            keepPreviousData: true,
            cacheTime: 1,
            staleTime: 0,
        }
    );
    return { subscriptionData: data?.data, pagination: data?.pagination, error, isLoading, isError, isSuccess, refetch };
};

export default useGetAllSubscriptionHistory;
