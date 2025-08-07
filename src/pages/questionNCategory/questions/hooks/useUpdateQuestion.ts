import { useMutation } from 'react-query';
import { updateQuestionData } from '../core/_request';

const useUpdateQuestion = () => {
    const { mutate, isError, error, isLoading, isSuccess } = useMutation((body: any) => updateQuestionData(body));

    return { updateQuestion: mutate, isError, error, singleDeleteLoading: isLoading, isSuccess };
};

export default useUpdateQuestion;