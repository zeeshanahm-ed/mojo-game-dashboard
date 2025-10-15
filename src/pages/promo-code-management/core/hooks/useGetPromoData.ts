// import { useQuery } from 'react-query';
// import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
// import { getPromoCodes } from "../_requests";

// const useGetPromoData = (params: any) => {
//     const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_PROMO_CODES, , params], () => getPromoCodes(params),
//         {
//             cacheTime: 0,
//             staleTime: 0,
//         }
//     );
//     return { promoData: data?.data?.data, pagination: data?.data?.pagination, error, isLoading, isError, isSuccess, refetch };
// }


// export default useGetPromoData;