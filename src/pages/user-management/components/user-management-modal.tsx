import { Divider, Modal, Select } from 'antd';
import Input from 'antd/es/input/Input';

import Button from 'components/core-ui/button/button';

import UserIcon from 'assets/icons/services-user-icon.svg?react';

function UserManagementModal({ onCancel, open, name, handleOkButton, disabled }: any) {
  return (
    <Modal
      style={{ textAlign: 'center' }}
      centered
      footer={null}
      title={<p className='text-lg'>Change Role</p>}
      onCancel={onCancel}
      open={open}
    >
      <Divider />
      <Input disabled={disabled} prefix={<UserIcon className='me-3' />} placeholder={name} />
      <Select
        allowClear
        className='h-14 mt-5 text-left'
        style={{ width: '100%' }}
        size='large'
        placeholder='Select Role'
        options={[
          { value: 'superAdmin', label: 'Super Admin' },
          { value: 'operations', label: 'Team Member' },
          { value: 'billings', label: 'Billings' },
        ]}
      />
      <div className='flex justify-center gap-3 my-5'>
        <Button variant='primary' className='text-base px-14' onClick={handleOkButton}>
          Update
        </Button>
      </div>
    </Modal>
  );
}

export default UserManagementModal;
