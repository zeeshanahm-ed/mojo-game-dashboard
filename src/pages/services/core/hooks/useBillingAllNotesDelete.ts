import { useMutation } from 'react-query';

import { deleteBillingAllNotes } from '../_requests';

function useBillingAllNotesDelete() {
    const { mutate, isLoading } = useMutation((ids: any) => deleteBillingAllNotes(ids));
    return {
        deleteBillingAllNotes: mutate,
        isDeletingBilling: isLoading,
    };
}

export default useBillingAllNotesDelete;
