import { useMutation } from "react-query";
import { moveQuestionToPandingPool } from "../_requests";

const useMoveQuestionToPandingPool = () => {
    const {
        mutate: moveQuestionToPandingPoolMutate,
        isLoading,
    } = useMutation((body: any) => moveQuestionToPandingPool(body));

    return {
        moveQuestionToPandingPoolMutate,
        isLoading
    };
};

export default useMoveQuestionToPandingPool;