import { useMutation } from 'react-query';
import { updateWarningData } from '../core/_request';

const useUpdateWarning = () => {
    const { mutate, isError, error, isLoading, isSuccess } = useMutation((body: any) => updateWarningData(body));

    return { updateWarning: mutate, isError, error, singleDeleteLoading: isLoading, isSuccess };
};

export default useUpdateWarning;