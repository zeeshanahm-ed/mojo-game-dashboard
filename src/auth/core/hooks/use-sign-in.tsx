import { useEffect } from 'react';
import { useMutation } from 'react-query';

import { ISignInForm } from '../_models';
import { getUserByToken, login } from '../_requests';
import { useAuth } from '../auth-context';

const useSignIn = () => {
  const { saveAuth, setCurrentUser } = useAuth();

  const { mutate: signInMutate, isError, error, isLoading, isSuccess, data } = useMutation((body: ISignInForm) => login(body));

  const { mutate: mutateVerifyToken } = useMutation((token: string) => getUserByToken(token));

  useEffect(() => {
    if (isSuccess && data) {
      const apiToken = data?.data?.data?.api_token;
      if (apiToken) {
        mutateVerifyToken(apiToken, {
          onSuccess: (res) => {
            const authData = {
              api_token: apiToken,
              data: res?.data,
            };
            saveAuth(authData);
            setCurrentUser(res?.data);
          },
        });
      }
    }
  }, [data, isSuccess, mutateVerifyToken, saveAuth, setCurrentUser]);

  return { signInMutate, isError, error, isLoading, isSuccess };
};

export default useSignIn;
