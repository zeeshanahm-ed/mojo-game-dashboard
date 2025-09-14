import { useMutation } from "react-query";
import { publishQuestion } from "../_requests";

const usePublishQuestion = () => {
    const {
        mutate: publishQuestionMutate,
        isLoading,
    } = useMutation((body: any) => publishQuestion(body));

    return {
        publishQuestionMutate,
        isLoading
    };
};

export default usePublishQuestion;