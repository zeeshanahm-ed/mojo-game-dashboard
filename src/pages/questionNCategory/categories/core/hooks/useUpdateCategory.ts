import { useMutation } from 'react-query';
import { updateCategoryData, } from '../_requests';

const useUpdateCategory = () => {
    const { mutate, isError, error, isLoading, isSuccess } = useMutation(({ body, id }: { body: FormData, id: string }) => updateCategoryData(body, id));

    return { updateCategoryMutate: mutate, isError, error, isUpdateCategoryLoading: isLoading, isSuccess };
};

export default useUpdateCategory;