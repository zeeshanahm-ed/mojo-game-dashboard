import { useMutation } from "react-query";
import { updateLead } from "../_requests";

const useUpdateLead = () => {
    const {
        mutate: updateLeadMutate,
        isError: isUpdateLeadError,
        error: updateLeadError,
        isLoading: isUpdateLeadLoading,
        isSuccess: isUpdateLeadSuccess,
    } = useMutation(({ id, body }: { id: string; body: any }) => updateLead(id, body));

    return {
        updateLeadMutate,
        isUpdateLeadError,
        updateLeadError,
        isUpdateLeadLoading,
        isUpdateLeadSuccess,
    };
};

export default useUpdateLead;