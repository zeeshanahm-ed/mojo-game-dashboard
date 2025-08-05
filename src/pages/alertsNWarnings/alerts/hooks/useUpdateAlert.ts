import { useMutation } from 'react-query';
import { updateAlertData } from '../core/_requests';

const useUpdateAlert = () => {
    const { mutate, isError, error, isLoading, isSuccess } = useMutation((body: any) => updateAlertData(body));

    return { updateAlert: mutate, isError, error, singleDeleteLoading: isLoading, isSuccess };
};

export default useUpdateAlert;