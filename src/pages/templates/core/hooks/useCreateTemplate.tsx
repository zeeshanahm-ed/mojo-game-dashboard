import { useMutation } from 'react-query';
import { createTemplate } from '../_requests';

const useCreateTemplate = () => {
  // Create case mutation
  const {
    mutate: createTemplateMutate,
    isError: isCreateTemplateError,
    error: createTemplateError,
    isLoading: isCreateTemplateLoading,
    isSuccess: isCreateTemplateSuccess,
  } = useMutation((body: any) => createTemplate(body));


  return {
    createTemplateMutate,
    isCreateTemplateError,
    createTemplateError,
    isCreateTemplateLoading,
    isCreateTemplateSuccess,
  };
};

export default useCreateTemplate;
