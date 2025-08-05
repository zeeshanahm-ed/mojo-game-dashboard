import { useMutation } from 'react-query';
import { createBillingData, createCaseData } from '../_requests';

const useCreateCase = () => {
  // Create case mutation
  const {
    mutate: createCaseMutate,
    isError: isCreateCaseError,
    error: createCaseError,
    isLoading: isCreateCaseLoading,
    isSuccess: isCreateCaseSuccess,
  } = useMutation((body: any) => createCaseData(body));

  // Create billing data mutation
  const {
    mutate: createBillingMutate,
    isError: isBillingError,
    error: billingError,
    isLoading: isBillingLoading,
    isSuccess: isBillingSuccess,
  } = useMutation((body: any) => createBillingData(body));

  return {
    createCaseMutate,
    isCreateCaseError,
    createCaseError,
    isCreateCaseLoading,
    isCreateCaseSuccess,
    createBillingMutate,
    isBillingError,
    billingError,
    isBillingLoading,
    isBillingSuccess,
  };
};

export default useCreateCase;
