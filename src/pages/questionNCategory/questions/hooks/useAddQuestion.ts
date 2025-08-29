import { useMutation } from 'react-query';
import { addQuestion } from '../core/_request';


const useAddQuestion = () => {
    const { mutate: addQuestionMutate, isError, error, isLoading, isSuccess } = useMutation((body: FormData) => addQuestion(body));

    return { addQuestionMutate, isError, error, isLoading, isSuccess };
};

export default useAddQuestion;
