import { useMutation } from "react-query";
import { updateMember } from "../_requests";
import { AddUserParams } from "../_models";

const useUpdateMember = () => {
    // Create Update Member mutation
    const {
        mutate: updateMemberMutate,
        isError: isUpdateMemberError,
        error: updateMemberError,
        isLoading: isUpdateMemberLoading,
        isSuccess: isUpdateMemberSuccess,
    } = useMutation(({ body, id }: { body: AddUserParams, id: string }) => updateMember(body, id));

    return {
        updateMemberMutate,
        isUpdateMemberError,
        updateMemberError,
        isUpdateMemberLoading,
        isUpdateMemberSuccess,
    };
};

export default useUpdateMember;