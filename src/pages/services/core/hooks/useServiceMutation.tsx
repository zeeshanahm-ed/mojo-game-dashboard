import { useMutation } from 'react-query';
import { showSuccessMessage, showErrorMessage } from 'utils/messageUtils';
import { createServiceData, deleteService} from '../_requests';

const useServiceMutation = (refetch: () => void) => {
  // Mutation for creating a service
  const createMutation = useMutation(
    (data: any) => createServiceData(data),
    {
      onSuccess: () => {
        showSuccessMessage('Service successfully added');
        refetch();  // Refetch the data after a successful creation
      },
      onError: (error) => {
        showErrorMessage('Failed to add service');
        console.error('Error creating service:', error);
      },
    }
  );

  // Mutation for deleting a service (or client)
  const deleteMutation = useMutation(
    (id: string) => deleteService(id),
    {
      onSuccess: () => {
        showSuccessMessage('Service successfully deleted');
        refetch();  
      },
      onError: (error) => {
        showErrorMessage('Failed to delete service');
        console.error('Error deleting service:', error);
      },
    }
  );

  // Return both create and delete mutations so they can be used separately
  return {
    createService: createMutation.mutate,  
    deleteService: deleteMutation.mutate,  
  };
};

export default useServiceMutation;
