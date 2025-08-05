import { useMutation } from 'react-query';
import { updatePassCode} from '../_requests';

const useUpdatePassword = () => {
  const mutation = useMutation((params: { id: any; data: any }) => updatePassCode(params.id));

  return { updatePassword:mutation.mutate };
};

export default useUpdatePassword;
