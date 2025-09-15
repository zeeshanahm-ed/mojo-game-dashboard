import { useMutation } from "react-query";
import { changeCategoryStatus } from "../_requests";

const useChangeCategoryStatus = () => {
    const {
        mutate: changeCategoryStatusMutate,
        isError: isChangeStatusError,
        error: changeStatusError,
        isLoading: isChangeStatusLoading,
        isSuccess: isChangeStatusSuccess,
    } = useMutation(({ id, params }: { id: string; params: any }) => changeCategoryStatus(id, params));

    return {
        changeCategoryStatusMutate,
        isChangeStatusError,
        changeStatusError,
        isChangeStatusLoading,
        isChangeStatusSuccess,
    };
};

export default useChangeCategoryStatus;