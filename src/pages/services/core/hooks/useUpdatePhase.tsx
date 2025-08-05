import { useMutation } from 'react-query';
import { updateCaseDocuments } from '../_requests';

const useUpdatePhase = () => {
  const { mutate, isError, error, isLoading, isSuccess } = useMutation(
    ({ id, body }: { id: string; body: any }) => updateCaseDocuments(id, body)
  );

  return { updatePhase: mutate, isError, error, singleDeleteLoading:isLoading, isSuccess };
};

export default useUpdatePhase;
