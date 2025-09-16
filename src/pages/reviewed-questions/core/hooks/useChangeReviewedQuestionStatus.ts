import { useMutation } from "react-query";
import { changeReviewedQuestionStatus } from "../_requests";

const useChangeReviewedQuestionStatus = () => {
    const {
        mutate: changeReviewedQuestionStatusMutate,
        isLoading,
    } = useMutation((body: any) => changeReviewedQuestionStatus(body));

    return {
        changeReviewedQuestionStatusMutate,
        isLoading
    };
};

export default useChangeReviewedQuestionStatus;