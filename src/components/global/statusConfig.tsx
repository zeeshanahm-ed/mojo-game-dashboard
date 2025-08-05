interface StatusConfig {
    label: string;
    color: string;
    icon: React.ReactNode;
}

export enum StatusType {
    COMPLETED = 'COMPLETED',
    IN_PROGRESS = 'IN_PROGRESS',
    CANCELLED = 'CANCELLED',
    NOT_STARTED = 'NOT_STARTED',
    OVERDUE = 'OVERDUE',
}

import CircleIcon from "assets/icons/circle-icon.svg?react";
import CompleteIcon from "assets/icons/complete-icon.svg?react";
import OverdueIcon from "assets/icons/overdue-icon.svg?react";
import CancelledIcon from "assets/icons/x-icon.svg?react";


export const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
    [StatusType.COMPLETED]: {
        label: 'Completed',
        color: 'primary',
        icon: <div className='bg-primary p-[6px] rounded-full w-7 h-7 flex-centered'><CompleteIcon /></div>,

    },
    [StatusType.IN_PROGRESS]: {
        label: 'In Progress',
        color: 'secondary',
        icon: <div className='bg-secondary p-[6px] rounded-full w-7 h-7 flex-centered'><CircleIcon /></div>,
    },
    [StatusType.CANCELLED]: {
        label: 'Cancelled',
        color: 'dark-gray',
        icon: <div className='bg-dark-gray p-[6px] rounded-full w-7 h-7 flex-centered'><CancelledIcon /></div>,

    },
    [StatusType.NOT_STARTED]: {
        label: 'Not Started',
        color: 'light-gray',
        icon: <div className='bg-light-gray p-[6px] rounded-full w-7 h-7 flex-centered'><CircleIcon /></div>,
    },
    [StatusType.OVERDUE]: {
        label: 'OverDue',
        color: 'danger',
        icon: <div className='bg-danger p-[6px] rounded-full w-7 h-7 flex-centered'><OverdueIcon /></div>,
    },
};