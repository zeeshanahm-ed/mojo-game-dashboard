import { useQuery } from 'react-query';

import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { getAllCaseDocuments } from '../_requests';


const useGetAllCase = () => {
  const { data, error, isLoading, isError, isSuccess, refetch  } = useQuery([QUERIES_KEYS.GET_ALL_CASE_DATA], () => getAllCaseDocuments(),
);

  return { caseAllDocumentData: data?.data, error, isLoadingCase:isLoading, isError, isSuccess , refetchCaseData:refetch};
};

export default useGetAllCase;
