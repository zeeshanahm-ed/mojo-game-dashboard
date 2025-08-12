import { useMutation } from 'react-query';

import { getUserByToken } from '../_requests';

const useVerifyToken = () => {
    const { mutate: mutateVerifyToken, isError, error, isLoading, isSuccess } = useMutation((token: string) => getUserByToken(token));


    return { mutateVerifyToken, isError, error, isLoading, isSuccess };
};

export default useVerifyToken;
