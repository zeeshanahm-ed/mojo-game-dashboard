import { useMutation } from "react-query";
import { createLead } from "../_requests";

const useCreateLead = () => {
    // Create Lead mutation
    const {
        mutate: createLeadMutate,
        isError: isCreateLeadError,
        error: createLeadError,
        isLoading: isCreateLeadLoading,
        isSuccess: isCreateLeadSuccess,
    } = useMutation((body: any) => createLead(body));

    return {
        createLeadMutate,
        isCreateLeadError,
        createLeadError,
        isCreateLeadLoading,
        isCreateLeadSuccess,
    };
};

export default useCreateLead;