import { useMutation } from "react-query";
import { deleteQuestion } from "../core/_request";

const useDeleteQuestion = () => {
    const {
        mutate: deleteQuestionMutate,
        isError: isQuestionError,
        error: questionError,
        isLoading: isQuestionLoading,
        isSuccess: isQuestionSuccess,
    } = useMutation((ids: any) => deleteQuestion(ids));

    return {
        deleteQuestionMutate,
        isQuestionError,
        questionError,
        isQuestionLoading,
        isQuestionSuccess,
    };
};

export default useDeleteQuestion;