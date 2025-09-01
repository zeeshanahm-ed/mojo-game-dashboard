import { create } from 'zustand';

type UsersStore = {
    usersData: any;
    setUsersData: (usersData: any) => void;
};


export const useGetAllUsersDataForDropDownFromStore = create<UsersStore>((set) => ({
    usersData: null,
    setUsersData: (usersData: any) => set({ usersData }),
}));
