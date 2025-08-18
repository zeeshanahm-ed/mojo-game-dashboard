import { useMutation } from "react-query";
import { addCategory } from "../_requests";

const useAddCategory = () => {
    // Create Add Category mutation
    const {
        mutate: addCategoryMutate,
        isError: isAddCategoryError,
        error: addCategoryError,
        isLoading: isAddCategoryLoading,
        isSuccess: isAddCategorySuccess,
    } = useMutation((body: any) => addCategory(body));

    return {
        addCategoryMutate,
        isAddCategoryError,
        addCategoryError,
        isAddCategoryLoading,
        isAddCategorySuccess,
    };
};

export default useAddCategory;