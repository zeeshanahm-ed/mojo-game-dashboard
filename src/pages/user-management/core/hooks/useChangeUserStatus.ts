import { useMutation } from 'react-query';

import { changeUserStatus } from '../_requests';
import { ChangeStatusParams } from '../_modals';


function useChangeUserStatus() {
    const { mutate, isLoading } = useMutation((body: ChangeStatusParams,) => changeUserStatus(body));
    return {
        changeStatusMutate: mutate,
        isLoading: isLoading,
    };
}

export default useChangeUserStatus;