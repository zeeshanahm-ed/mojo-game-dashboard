import { useMutation } from "react-query";
import { deleteAlerts } from "../core/_requests";

const useDeleteAlerts = () => {
    const {
        mutate: deleteAlertMutate,
        isError: isAlertError,
        error: alertError,
        isLoading: isAlertLoading,
        isSuccess: isAlertSuccess,
    } = useMutation((ids: any) => deleteAlerts(ids));

    return {
        deleteAlertMutate,
        isAlertError,
        alertError,
        isAlertLoading,
        isAlertSuccess,
    };
};

export default useDeleteAlerts;