import { create } from 'zustand';

type UsersStore = {
    allUsersData: any;
    setUsersData: (usersData: any) => void;
};


export const useGetAllUsersDataForDropDownFromStore = create<UsersStore>((set) => ({
    allUsersData: null,
    setUsersData: (allUsersData: any) => set({ allUsersData }),
}));
