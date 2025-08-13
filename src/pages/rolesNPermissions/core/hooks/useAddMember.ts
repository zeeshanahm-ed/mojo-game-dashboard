import { useMutation } from "react-query";
import { addMember } from "../_requests";
import { AddUserParams } from "../_models";

const useAddMember = () => {
    // Create Add Member mutation
    const {
        mutate: addMemberMutate,
        isError: isAddMemberError,
        error: addMemberError,
        isLoading: isAddMemberLoading,
        isSuccess: isAddMemberSuccess,
    } = useMutation((body: AddUserParams) => addMember(body));

    return {
        addMemberMutate,
        isAddMemberError,
        addMemberError,
        isAddMemberLoading,
        isAddMemberSuccess,
    };
};

export default useAddMember;