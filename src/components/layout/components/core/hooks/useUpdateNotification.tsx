import { useMutation } from 'react-query';
import { updateNotificationAssign } from '../_request';

const useUpdateNotification = () => {
  const mutation = useMutation(updateNotificationAssign);

  // Return the correct mutate function from the useMutation hook
  return { mutate: mutation.mutate };
};

export default useUpdateNotification;
