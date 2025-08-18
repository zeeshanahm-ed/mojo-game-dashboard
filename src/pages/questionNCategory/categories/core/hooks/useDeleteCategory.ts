import { useMutation } from "react-query";
import { deleteCategory } from "../_requests";

const useDeleteCategory = () => {
    const {
        mutate: deleteCategoryMutate,
        isError: isCategoryError,
        error: categoryError,
        isLoading: isCategoryLoading,
        isSuccess: isCategorySuccess,
    } = useMutation((id: string) => deleteCategory(id));

    return {
        deleteCategoryMutate,
        isCategoryError,
        categoryError,
        isCategoryLoading,
        isCategorySuccess,
    };
};

export default useDeleteCategory;