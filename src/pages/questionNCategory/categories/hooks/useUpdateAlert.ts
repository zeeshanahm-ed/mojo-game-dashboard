import { useMutation } from 'react-query';
import { updateCategoryData, } from '../core/_requests';

const useUpdateCategory = () => {
    const { mutate, isError, error, isLoading, isSuccess } = useMutation((body: any) => updateCategoryData(body));

    return { updateCategory: mutate, isError, error, isLoading, isSuccess };
};

export default useUpdateCategory;