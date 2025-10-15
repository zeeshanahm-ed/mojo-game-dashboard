import { useQuery } from 'react-query';
import { getSingleQuestionData } from '../core/_request';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useGetSingleQuestion = (id: string) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_SINGLE_QUESTIONS], () => getSingleQuestionData(id),
        {
            cacheTime: 0,
            staleTime: 0,
        }
    );

    return { questionData: data?.data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useGetSingleQuestion;