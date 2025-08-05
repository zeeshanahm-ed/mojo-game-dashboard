import { useMutation } from 'react-query';
import { updateServiceAssign } from '../_requests';

const useUpdateServiceAssign = () => {
  const {
    mutate,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useMutation(
    (params: { id: string; data: any }) => updateServiceAssign(params.id, params.data)
  );

  return {
    mutate,
    responseData: data?.data, // 👈 unwrap response if needed
    error,
    isLoading,
    isSuccess,
    isError,
  };
};

export default useUpdateServiceAssign;