import { useMutation } from "react-query";
import { handleDeleteAllNotes } from "../_requests";

function useDeleteAllNotes() {
    const { mutate, isLoading } = useMutation(
        (payload: any) => handleDeleteAllNotes(payload)
    );
    return {
        deletAllNotes: mutate,
        isDeletingCase: isLoading,
    };
}

export default useDeleteAllNotes;