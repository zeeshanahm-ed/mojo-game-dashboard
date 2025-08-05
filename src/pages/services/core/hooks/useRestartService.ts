import { useMutation } from 'react-query';
import { createRestartService } from '../_requests';

const useRestartService = () => {
    const {
        mutate: restartServiceMutate,
        isError: isRestartServiceError,
        error: restartServiceError,
        isLoading: isRestartServiceLoading,
        isSuccess: isRestartServiceSuccess,
        data: restartServiceData,
    } = useMutation((body: any) => createRestartService(body));

    return {
        restartServiceMutate,
        isRestartServiceError,
        restartServiceError,
        isRestartServiceLoading,
        isRestartServiceSuccess,
        restartServiceData,
    };
};

export default useRestartService;
