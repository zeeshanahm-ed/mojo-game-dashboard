import { useMutation } from "react-query";
import { changeQuestionStatus } from "../core/_request";

const useChangeQuestionStatus = () => {
    const {
        mutate: changeQuestionStatusMutate,
        isError: isChangeStatusError,
        error: changeStatusError,
        isLoading: isChangeStatusLoading,
        isSuccess: isChangeStatusSuccess,
    } = useMutation(({ id, params }: { id: string; params: any }) => changeQuestionStatus(id, params));

    return {
        changeQuestionStatusMutate,
        isChangeStatusError,
        changeStatusError,
        isChangeStatusLoading,
        isChangeStatusSuccess,
    };
};

export default useChangeQuestionStatus;