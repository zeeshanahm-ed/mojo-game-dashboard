import { useMutation, useQueryClient } from 'react-query';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import { deleteService } from '../_requests';
import { useNavigate } from 'react-router-dom';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useServiceDelete = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    (id: string) => deleteService(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERIES_KEYS.GET_SERVICE);
        showSuccessMessage('Successfully deleted service');
        navigate('/services');
      },
      onError: (error) => {
        showErrorMessage('Failed to delete service');
        console.error('Error deleting service:', error);
      },
    }
  );

  return {
    deleteService: deleteMutation.mutate,
  };
};

export default useServiceDelete;
