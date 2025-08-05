import { DatePicker, Divider, Modal, Select } from 'antd';

import Button from 'components/core-ui/button/button';
import { useState } from 'react';
import { invoiceStatus } from 'utils/global.status';

const { RangePicker } = DatePicker;

function FiltersModal({ onCancel, open, handleOkButton }: any) {
  const [status, setStatus] = useState();
  const [date, setDate] = useState(null);
  const handleChangeStatus = (value: any) => {
    setStatus(value);
  }
  const handleChangeRange = (dates: any) => {
    if (dates) {
      setDate(dates);
    } else {
      setDate(null);
    }
  };
  const onFinish = () => {
    const data = {
      status: status,
      date: date
    }
    handleOkButton(data);
    onCancel();
  }
  return (
    <Modal
      style={{ textAlign: 'center' }}
      centered
      footer={null}
      title={<p className='text-lg'>Filters & Sort</p>}
      onCancel={onCancel}
      open={open}
    >
      <Divider />
      <p className='text-left text-light-gray'>Invoice Status</p>
      <Select
        size='large'
        className='h-11 custom-radius mt-5'
        mode='multiple'
        allowClear
        style={{ width: '100%' }}
        placeholder='Select type of Invoice'
        onChange={handleChangeStatus}
        options={[
          { value: invoiceStatus.PAID, label: 'Paid' },
          { value: invoiceStatus.CANCELLED, label: 'Cancelled' },
          { value: invoiceStatus.UNPAID, label: 'Unpaid' },
          { value: invoiceStatus.SENT, label: 'Sent' },
        ]}
      />
      <p className='text-left text-light-gray pb-2 pt-5'>Start - End Date</p>
      <RangePicker className='w-full h-11 custom-radius' onChange={handleChangeRange} format='MM-DD-YYYY' />
      <div className='flex justify-center gap-5 pt-5 my-5' onClick={onFinish}>
        <Button variant='primary' className='text-base font-medium px-16 h-11 custom-radius' >
          Apply
        </Button>
      </div>
    </Modal>
  );
}

export default FiltersModal;
