import { useQuery } from 'react-query';
import { getQuestionsData } from '../core/_request';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useQuestionsData = (params: any) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_QUESTIONS, , params], () => getQuestionsData(params),
        {
            cacheTime: 1,
            staleTime: 0,
        }
    );

    return { questionsData: data?.data, error, isLoading, isError, isSuccess, refetch };
};

export default useQuestionsData;