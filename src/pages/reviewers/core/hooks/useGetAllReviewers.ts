import { useQuery } from "react-query";
import { QUERIES_KEYS } from "helpers/crud-helper/consts";
import { getAllReviewers } from "../_requests";

const useGetAllReviewers = (params: any) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_ALL_REVIEWERS, params], () => getAllReviewers(params),
        {
            cacheTime: 1,
            staleTime: 0,
        }
    );
    return { reviewersData: data?.data?.data, pagination: data?.data?.pagination, error, isLoading, isError, isSuccess, refetch };
};

export default useGetAllReviewers;