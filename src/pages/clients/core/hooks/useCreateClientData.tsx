import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { showSuccessMessage, showErrorMessage } from 'utils/messageUtils'; // Import showErrorMessage

import { createClientData } from '../_requests';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import axios from 'axios';

const useCreateClientData = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (params: { id: string; data: any }) => createClientData(params.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERIES_KEYS.GET_CLIENTS);
        showSuccessMessage('Client successfully added');
        navigate('/clients');
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'An error occurred while adding the client';
          showErrorMessage(errorMessage);
        } else {
          showErrorMessage('An unexpected error occurred');
        }
      }
    }
  );

  return {
    ...mutation,
    mutateAsync: mutation.mutateAsync, // expose mutateAsync
  };
};

export default useCreateClientData;