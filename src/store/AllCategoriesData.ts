import { create } from 'zustand';

type CategoriesStore = {
    categoriesData: any;
    setCategoriesData: (categoriesData: any) => void;
};


export const useGetAllCategoriesDataForDropDownFromStore = create<CategoriesStore>((set) => ({
    categoriesData: null,
    setCategoriesData: (categoriesData: any) => set({ categoriesData }),
}));
