import { useMutation } from 'react-query';

import { deleteTemplate } from '../_requests';

function useTemplateDelete() {
  const { mutate, isLoading } = useMutation((id: any) => deleteTemplate(id));
  return {
    deleteTemplate: mutate,
    isDeleteLoading: isLoading,
  };
}

export default useTemplateDelete;
