import { useEffect, useState } from 'react';

import { DatePicker, Divider, Input, Modal, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import Button from 'components/core-ui/button/button';

const { RangePicker } = DatePicker;

function AddDetailAuth({
  isLoading,
  open,
  onCancel,
  onOk,
  resetTrigger,
  handleUpdate,
  serviceData,
  singleDeleteLoading,
  editModalData,
}: any) {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [hoursToWork, setHoursToWork] = useState('');
  const [actualHoursWorked, setActualHoursWorked] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      // If editModalData exists, prefill fields with its values
      if (editModalData) {
        setDateRange([
          editModalData.startDate ? dayjs(editModalData.startDate) : null,
          editModalData.endDate ? dayjs(editModalData.endDate) : null,
        ]);
        setHoursToWork(editModalData.totalWorkingHours || '');
        setActualHoursWorked(editModalData.workingHours || '');
        setNotes(editModalData.description || '');
      } else {
        // Reset fields if no edit data is provided
        setDateRange(null);
        setHoursToWork('');
        setActualHoursWorked('');
        setNotes('');
      }
    }
  }, [open, resetTrigger, editModalData]);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
  };

  const handleHoursWorkChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === "hoursToWork") {
      setHoursToWork(e.target.value);
    } else {
      setActualHoursWorked(e.target.value)
    }
  };


  const handleOkButton = () => {
    onOk({
      dateRange,
      hoursToWork,
      actualHoursWorked,
      notes,
    });
  };

  const handleUpdateButton = () => {
    handleUpdate({
      dateRange,
      hoursToWork,
      actualHoursWorked,
      notes,
      editModalData,
    });
  };

  return (
    <Modal
      style={{ textAlign: 'center' }}
      onCancel={onCancel}
      centered
      footer={null}
      title={<p className='text-lg'>{editModalData ? 'Edit Details' : 'Add Details'}</p>}
      open={open}
    >
      <Divider />

      <RangePicker
        value={dateRange}
        onChange={handleDateChange}
        className='my-3 h-11 custom-radius'
        style={{ width: '100%' }}
        placeholder={['Start Date', 'End Date']}
        format='MM/DD/YYYY'
      />
      {serviceData?.data?.caseType?.name !== 'Individual Job Placement' && (
        <>
          <Input
            type='number'
            placeholder='Number of Hours to Work'
            value={hoursToWork}
            onChange={(e) => handleHoursWorkChange(e, "hoursToWork")}
            className='my-3 h-11 custom-radius'
          />
        </>
      )
      }
      {serviceData?.data?.caseType?.name !== 'Individual Job Placement' && (
        <>
          <Input
            type='number'
            placeholder='Actual Hours Worked'
            value={actualHoursWorked}
            onChange={(e) => handleHoursWorkChange(e, "actualHoursWorked")}
            className='my-3 h-11 custom-radius'
          />
        </>
      )
      }

      {editModalData ? (
        <div className='flex justify-center gap-3 my-5'>
          <Button variant='primary' className='text-base px-20 h-11 custom-radius' onClick={handleUpdateButton}>
            {singleDeleteLoading ? <Spin className='custom-spin' /> : 'Update'}
          </Button>
        </div>
      ) : (
        <div className='flex justify-center gap-3 my-5 '>
          <Button variant='primary' className='text-base px-20 h-11 custom-radius' onClick={handleOkButton}>
            {isLoading ? <Spin className='custom-spin' /> : 'Submit'}
          </Button>
        </div>
      )}
    </Modal>
  );
}

export default AddDetailAuth;
