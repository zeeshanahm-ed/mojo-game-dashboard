import { useMutation } from 'react-query';

import { deleteCaseDocument } from '../_requests';

function useCaseDataDelete() {
  const { mutate, isLoading } = useMutation((id: string) => deleteCaseDocument(id));
  return {
    deleteCaseData: mutate,
    isDeletingCase: isLoading,
  };
}

export default useCaseDataDelete;
