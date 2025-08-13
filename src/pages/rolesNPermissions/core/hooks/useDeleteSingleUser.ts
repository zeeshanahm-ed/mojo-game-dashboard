import { useMutation } from 'react-query';

import { deleteSingleUser } from '../_requests';
import { DeleteSingleUserParams } from '../_models';


function useDeleteSingleUser() {
    const { mutate, isLoading } = useMutation((body: DeleteSingleUserParams) => deleteSingleUser(body));
    return {
        deleteSingleUser: mutate,
        isLoading: isLoading,
    };
}

export default useDeleteSingleUser;