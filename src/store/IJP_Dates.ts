import { create } from 'zustand';
import { Dayjs } from 'dayjs';

interface IJPDateStore {
    jobSearchDate: Dayjs | null;
    jobSearchEndDate: Dayjs | null;
    jobHiringDate: Dayjs | null;
    jobHiringLastDate: Dayjs | null;

    // Setter functions
    setJobSearchDate: (date: Dayjs | null) => void;
    setJobSearchEndDate: (date: Dayjs | null) => void;
    setJobHiringDate: (date: Dayjs | null) => void;
    setJobHiringLastDate: (date: Dayjs | null) => void;

    // Optional: Set multiple dates at once
    setAllDates: (dates: Partial<Omit<IJPDateStore, 'setJobSearchDate' | 'setJobSearchEndDate' | 'setJobHiringDate' | 'setJobHiringLastDate' | 'setAllDates'>>) => void;
}

export const useHandleIJPDates = create<IJPDateStore>((set) => ({
    jobSearchDate: null,
    jobSearchEndDate: null,
    jobHiringDate: null,
    jobHiringLastDate: null,

    setJobSearchDate: (date) => set({ jobSearchDate: date }),
    setJobSearchEndDate: (date) => set({ jobSearchEndDate: date }),
    setJobHiringDate: (date) => set({ jobHiringDate: date }),
    setJobHiringLastDate: (date) => set({ jobHiringLastDate: date }),

    setAllDates: (dates) => set((state) => ({ ...state, ...dates })),
}));
