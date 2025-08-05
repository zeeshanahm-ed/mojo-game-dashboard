import { useMutation } from 'react-query';
import { updateUser } from '../_requests';

const userUpdate = () => {
  const mutation = useMutation((params: { id: any; data: any }) => updateUser(params.id, params.data));

  return { mutation };
};

export default userUpdate;
