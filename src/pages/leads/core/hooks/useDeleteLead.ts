import { useMutation } from "react-query";
import { deleteLead } from "../_requests";

const useDeleteLead = () => {
    const {
        mutate: deleteLeadMutate,
        isError: isDeleteLeadError,
        error: deleteLeadError,
        isLoading: isDeleteLeadLoading,
        isSuccess: isDeleteLeadSuccess,
    } = useMutation((id: string) => deleteLead(id));

    return {
        deleteLeadMutate,
        isDeleteLeadError,
        deleteLeadError,
        isDeleteLeadLoading,
        isDeleteLeadSuccess,
    };
};

export default useDeleteLead;