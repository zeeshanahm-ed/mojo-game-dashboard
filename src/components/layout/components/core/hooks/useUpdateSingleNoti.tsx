import { useMutation } from 'react-query';

import { updateSingleNotification } from '../_request';

const useUpdateSingleNotification = () => {
  const mutation = useMutation((id: string) => updateSingleNotification(id), {
    onSuccess: () => { },
    onError: () => { },
  });

  return mutation;
};

export default useUpdateSingleNotification;
