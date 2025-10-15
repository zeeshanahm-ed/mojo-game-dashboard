import { useQuery } from 'react-query';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getAllReviewedQuestions } from '../_requests';

const useGetReviewedQuestions = (params: any) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_ALL_REVIEWED_QUESTIONS, params], () => getAllReviewedQuestions(params),
        {
            cacheTime: 0,
            staleTime: 0,
        }
    );

    return { allReviewedsQuestionsData: data?.data?.data, pagination: { total: data?.data?.total }, error, isLoading, isError, isSuccess, refetch };
};

export default useGetReviewedQuestions;