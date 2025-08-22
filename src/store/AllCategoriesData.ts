import { create } from 'zustand';

type GameSessionStore = {
    data: any;
};


export const useGetAllCategoriesDataForDropDown = create<GameSessionStore>((set) => ({
    data: null,
    setData: (data: any) => set({ data }),
}));
