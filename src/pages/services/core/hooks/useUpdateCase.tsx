import { useMutation } from 'react-query';
import { updatePhasesCaseData } from '../_requests';

const useUpdateCase = () => {
    const {
        mutate: updateCaseMutate,
        isError: isUpdateCaseError,
        error: updateCaseError,
        isLoading: isUpdateCaseLoading,
        isSuccess: isUpdateCaseSuccess,
    } = useMutation(({ body, id }: { body: any; id: string }) => updatePhasesCaseData(body, id));

    return {
        updateCaseMutate,
        isUpdateCaseError,
        updateCaseError,
        isUpdateCaseLoading,
        isUpdateCaseSuccess,
    };
};

export default useUpdateCase;
