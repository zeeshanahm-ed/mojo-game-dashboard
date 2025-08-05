import { useMutation } from 'react-query';

import { deleteSingleNotification } from '../_request';

const useDeleteSingleNotification = () => {
    const mutation = useMutation((id: string) => deleteSingleNotification(id), {
        onSuccess: () => { },
        onError: () => { },
    });

    return mutation;
};

export default useDeleteSingleNotification;