import { useMutation } from 'react-query';

import { changeRole } from '../_requests';
import { ChangeRoleParams } from '../_models';


function useHandelChangeRole() {
    const { mutate, isLoading } = useMutation(({ role, id }: { role: ChangeRoleParams, id: string }) => changeRole(role, id));
    return {
        changeRoleMutate: mutate,
        isLoading: isLoading,
    };
}

export default useHandelChangeRole;