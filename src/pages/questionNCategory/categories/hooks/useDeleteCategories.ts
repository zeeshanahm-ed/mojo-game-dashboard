import { useMutation } from "react-query";
import { deleteCategory } from "../core/_requests";

const useDeleteCategories = () => {
    const {
        mutate: deleteCategoriesMutate,
        isError: isCategoriesError,
        error: categoriesError,
        isLoading: isCategoriesLoading,
        isSuccess: isCategoriesSuccess,
    } = useMutation((ids: any) => deleteCategory(ids));

    return {
        deleteCategoriesMutate,
        isCategoriesError,
        categoriesError,
        isCategoriesLoading,
        isCategoriesSuccess,
    };
};

export default useDeleteCategories;