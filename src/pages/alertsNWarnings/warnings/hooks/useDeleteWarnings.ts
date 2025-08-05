import { useMutation } from "react-query";
import { deleteWarnings } from "../core/_request";

const useDeleteWarnings = () => {
    const {
        mutate: deleteWarningsMutate,
        isError: isWarningsError,
        error: warningsError,
        isLoading: isWarningsLoading,
        isSuccess: isWarningsSuccess,
    } = useMutation((ids: any) => deleteWarnings(ids));

    return {
        deleteWarningsMutate,
        isWarningsError,
        warningsError,
        isWarningsLoading,
        isWarningsSuccess,
    };
};

export default useDeleteWarnings;