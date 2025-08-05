import { useMutation } from 'react-query';
import { updateBilling } from '../_requests';

const useDeleteSingleBillingDocument = () => {
  const { mutate, isError, error, isLoading, isSuccess } = useMutation(
    ({ id, body }: { id: string; body: any }) => updateBilling(id, body)
  );

  return { deleteSingleDocument: mutate, isError, error, singleDeleteLoading:isLoading, isSuccess };
};

export default useDeleteSingleBillingDocument;
