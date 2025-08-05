import { useMutation, useQueryClient } from 'react-query';
import { updateClientData } from '../_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { showSuccessMessage } from 'utils/messageUtils';

const useUpdateClientData = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ({ id, data }: { id: string; data: any }) => updateClientData(id, data ), // Ensure proper typing
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERIES_KEYS.GET_CLIENTS);
        showSuccessMessage('Client successfully updated');
        // Optionally, you can invalidate other queries or show success messages
      },
      onError: (error) => {
        console.error('Error updating client:', error); // You can handle error notifications here
      },
    }
  );

  return mutation;
};

export default useUpdateClientData;
