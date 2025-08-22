import { useMutation } from "react-query";
import { deleteQuestion } from "../core/_request";

const useDeleteQuestion = () => {
    const {
        mutate: deleteQuestionMutate,
        isError: isQuestionError,
        error: questionError,
        isLoading: isQuestionLoading,
        isSuccess: isQuestionSuccess,
    } = useMutation((id: string) => deleteQuestion(id));

    return {
        deleteQuestionMutate,
        isQuestionError,
        questionError,
        isQuestionLoading,
        isQuestionSuccess,
    };
};

export default useDeleteQuestion;