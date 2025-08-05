import { useMutation, useQueryClient } from 'react-query';

// import { ClientData } from '../_modals';
import { updateUser } from '../_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useUpdateData = (refetch: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation((params: { id: string; data: any }) => updateUser(params.id, params.data), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERIES_KEYS.GET_USERS);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating client:', error);
    },
  });

  return {
    ...mutation,
  };
};

export default useUpdateData;
