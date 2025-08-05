import { useRef, useState } from 'react';
import dayjs from "dayjs"

import Button from 'components/core-ui/button/button';
import { Select } from 'antd';

import CollapseExpandedIcon from 'assets/icons/collapse-icon-expanded.svg?react';
import CircleIcon from "assets/icons/circle-icon.svg?react";
import CompleteIcon from "assets/icons/complete-icon.svg?react";
import OverdueIcon from "assets/icons/overdue-icon.svg?react";
import CancelledIcon from "assets/icons/x-icon.svg?react";
import { CaretDownOutlined } from '@ant-design/icons';
//hooks & utilitis
import { STATUS_CONFIG, StatusType } from './global/statusConfig';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useCreateCase from 'pages/services/core/hooks/useCreateCase';
import useUpdateCase from 'pages/services/core/hooks/useUpdateCase';

interface propsInter {
  title: string;
  status: StatusType;
  collapsed: boolean;
  onToggle?: (collapsed: boolean) => void;
  children?: React.ReactNode;
  phase?: any;
  serviceData?: any;
  refetchCaseData?: any;
  phaseDetailId: string;
  updatedDate: string | null
}


const statusOptions = [
  {
    label: (
      <div className="flex items-center gap-2">
        <div className='bg-primary p-[6px] rounded-full w-7 h-7 flex-centered'><CompleteIcon /></div>
        <span className="text-primary font-medium">Completed</span>
      </div>
    ),
    value: 'COMPLETED',
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <div className='bg-secondary p-[6px] rounded-full w-7 h-7 flex-centered'><CircleIcon /></div>
        <span className="text-secondary font-medium">In Progress</span>
      </div>
    ),
    value: 'IN_PROGRESS',
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <div className='bg-dark-gray p-[6px] rounded-full w-7 h-7 flex-centered'><CancelledIcon /></div>
        <span className="text-dark-gray font-medium">Cancelled</span>
      </div>
    ),
    value: 'CANCELLED',
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <div className='bg-light-gray p-[6px] rounded-full w-7 h-7 flex-centered'><CircleIcon /></div>
        <span className="text-light-gray font-medium">Not Started</span>
      </div>
    ),
    value: 'NOT_STARTED',
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <div className='bg-danger p-[6px] rounded-full w-7 h-7 flex-centered'><OverdueIcon /></div>
        <span className="text-danger font-medium">OverDue</span>
      </div>
    ),
    value: 'OVERDUE',
  },
];

const statusCustomLabelsOptions = {
  Completed: {
    label: (
      <div className="flex items-center gap-2">
        <div className='bg-primary p-[6px] rounded-full w-7 h-7 flex-centered'><CompleteIcon /></div>
        <span className="text-primary font-medium">Completed</span>
      </div>
    ),
    value: 'COMPLETED',
  },
  "In Progress": {
    label: (
      <div className="flex items-center gap-2">
        <div className='bg-secondary p-[6px] rounded-full w-7 h-7 flex-centered'><CircleIcon /></div>
        <span className="text-secondary font-medium">In Progress</span>
      </div>
    ),
    value: 'IN_PROGRESS',
  },
  Cancelled: {
    label: (
      <div className="flex items-center gap-2">
        <div className='bg-dark-gray p-[6px] rounded-full w-7 h-7 flex-centered'><CancelledIcon /></div>
        <span className="text-dark-gray font-medium">Cancelled</span>
      </div>
    ),
    value: 'CANCELLED',
  },
  "Not Started": {
    label: (
      <div className="flex items-center gap-2">
        <div className='bg-light-gray p-[6px] rounded-full w-7 h-7 flex-centered'><CircleIcon /></div>
        <span className="text-light-gray font-medium">Not Started</span>
      </div>
    ),
    value: 'NOT_STARTED',
  },
  OverDue: {
    label: (
      <div className="flex items-center gap-2">
        <div className='bg-danger p-[6px] rounded-full w-7 h-7 flex-centered'><OverdueIcon /></div>
        <span className="text-danger font-medium">OverDue</span>
      </div>
    ),
    value: 'OVERDUE',
  },
};

function CollapsibleSection({
  title,
  status,
  collapsed,
  onToggle,
  children,
  refetchCaseData,
  phaseDetailId,
  updatedDate
}: propsInter) {
  const { color, label } = STATUS_CONFIG[status];
  const { createCaseMutate } = useCreateCase();
  const { updateCaseMutate } = useUpdateCase();
  const selectRef = useRef<any>(null);
  const [open, setOpen] = useState(false);



  const beforeBgClassMap: Record<string, string> = {
    primary: 'before:bg-primary',
    secondary: 'before:bg-secondary',
    danger: 'before:bg-danger',
    'dark-gray': 'before:bg-dark-gray',
    'light-gray': 'before:bg-light-gray',
  };

  const beforeBgClass = beforeBgClassMap[color] || 'before:bg-black';

  const handleChangeSelect = (value: StatusType) => {
    setOpen(false);
    const clientServiceData = {
      status: value,
    };

    const mutationConfig = {
      onSuccess: async () => {
        refetchCaseData();
        showSuccessMessage('Status updated successfully!');
      },
      onError: (error: any) => {
        console.error('Failed to update documents', error);
        showErrorMessage('Error while updating status!');
      },
    };

    if (phaseDetailId) {
      updateCaseMutate({ body: clientServiceData, id: phaseDetailId }, mutationConfig);
    } else {
      createCaseMutate(clientServiceData, mutationConfig);
    }
  };


  const handleIconClick = () => {
    setOpen((prev) => !prev); // toggle open state
  };


  return (
    <div className='relative'>
      <div className='flex items-center gap-5 mb-5'>
        <div className={`flex items-center gap-2 w-[180px] before:absolute before:w-[2px] ${beforeBgClass} before:left-[24px] before:top-6 before:h-full`}>
          <div className="w-full phases-selecter">
            <Select
              open={open}
              onOpenChange={(visible) => setOpen(visible)}
              ref={selectRef}
              placeholder="Filter by Service"
              variant="borderless"
              onChange={(status: any) => handleChangeSelect(status)}
              value={statusCustomLabelsOptions[label as keyof typeof statusCustomLabelsOptions]?.value}
              options={statusOptions}
              suffixIcon={<CaretDownOutlined className="text-gray-400 text-base" onClick={() => handleIconClick()} />}
              className="w-full max-w-md"
              getPopupContainer={(trigger) => trigger.parentNode} />
          </div>
        </div>
        <div className='flex items-center gap-2 w-full'>
          <h2 className='text-black text-nowrap text-lg font-semibold w-20'>{title}</h2>
          <Button variant='text' className=' justify-center' onClick={() => onToggle?.(!collapsed)}>
            {collapsed ? <CollapseExpandedIcon className='rotate-180' /> : <CollapseExpandedIcon />}
          </Button>
          <div className='w-full bg-black h-[2px]' />
          {updatedDate && label === "Completed" && <div className='text-nowrap'>Dated: {updatedDate ? dayjs(updatedDate).format("MM/DD/YYYY") : null}</div>}
        </div>
      </div>
      {collapsed === false ?
        <div className='ml-10 mb-5'>
          {children}
        </div> : <></>}
    </div>
  );
}

export default CollapsibleSection;
