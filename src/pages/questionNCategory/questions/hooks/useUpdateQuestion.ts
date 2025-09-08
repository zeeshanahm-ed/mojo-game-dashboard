import { useMutation } from 'react-query';
import { updateQuestionData } from '../core/_request';

const useUpdateQuestion = () => {
    const { mutate, isError, error, isLoading, isSuccess } = useMutation(({ body, id }: { body: FormData, id: string | null }) => updateQuestionData(body, id));

    return { updateQuestionMutate: mutate, isError, error, isLoading, isSuccess };
};

export default useUpdateQuestion;