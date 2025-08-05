import { useMutation } from 'react-query';

import { deleteBillingDocument } from '../_requests';

function useBillingCaseDelete() {
  const { mutate, isLoading } = useMutation((id: string) => deleteBillingDocument(id));
  return {
    deleteBillingData: mutate,
    isDeletingBilling: isLoading,
  };
}

export default useBillingCaseDelete;
