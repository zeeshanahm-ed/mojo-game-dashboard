import { useMutation } from 'react-query';
import { changePassword } from '../_requests';

const useChangePassword = () => {
    const { mutate: changePasswordMutate, isError, error, isLoading, isSuccess } = useMutation((body: any) => changePassword(body));

    return { changePasswordMutate, isError, error, isLoading, isSuccess };
};

export default useChangePassword;