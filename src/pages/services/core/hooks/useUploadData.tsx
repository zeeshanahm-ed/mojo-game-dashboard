import { useMutation } from 'react-query';

import { getPresignedUrl } from '../_requests';

const useUploadData = () => {
  const mutateSignedUrl = useMutation((data: any) => getPresignedUrl(data));

  return {
    getSignedUrl: mutateSignedUrl.mutate,
  };
};

export default useUploadData;
