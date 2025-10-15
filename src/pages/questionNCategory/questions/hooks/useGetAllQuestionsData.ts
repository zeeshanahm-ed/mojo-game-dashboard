import { useQuery } from 'react-query';
import { getQuestionsData } from '../core/_request';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { AllQuestionParams } from '../core/_modals';

const useGetAllQuestionsData = (params: AllQuestionParams) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery([QUERIES_KEYS.GET_QUESTIONS, params], () => getQuestionsData(params),
        {
            cacheTime: 0,
            staleTime: 0,
        }
    );

    return { questionsData: data?.data?.data, pagination: data?.data?.pagination, error, isLoading, isError, isSuccess, refetch };
};

export default useGetAllQuestionsData;