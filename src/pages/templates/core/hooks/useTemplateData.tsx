import { useQuery } from 'react-query';
import { getTemplateData } from '../_requests'; // Import createTemplate here
import { TemplateDataParams } from '../_modals'; // Assuming StandardServiceTemplate is defined here
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';

const useTemplateData = (params: TemplateDataParams) => {

  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery(
    [QUERIES_KEYS.GET_TEMPLATE, params], 
    () => getTemplateData(params)
  );
  const templateData = data?.data?.map((item: any) => ({
    uid: item?._id,
    name: item?.name || 'N/A',
    fileUrl: item?.fileUrl,
    tags: item?.tags
  })) || [];
  // Define the mutation for creating a template


  return {
    templateData,
    error,
    isLoading,
    isError,
    isSuccess,
    reftechTemplate:refetch,
  };
};

export default useTemplateData;
