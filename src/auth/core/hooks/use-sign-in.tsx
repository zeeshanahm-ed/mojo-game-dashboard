import { useMutation } from 'react-query';

import { ISignInForm } from '../_models';
import { login } from '../_requests';

const useSignIn = () => {

  const { mutate: signInMutate, isError, error, isLoading, isSuccess, } = useMutation((body: ISignInForm) => login(body));


  return { signInMutate, isError, error, isLoading, isSuccess };
};

export default useSignIn;
