import { Divider, Form, Modal, Select, Input } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Button from 'components/core-ui/button/button';
import { useEffect } from 'react';
import LockIcon from '../../../assets/icons/lock.svg?react';

function UserManagementAddModal({ onCancel, open, handleOkButton, selectedUser, handleUpdateButton }: any) {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    if (selectedUser) {
      handleUpdateButton({ ...values, id: selectedUser._id });
    } else {
      handleOkButton(values);
    }
  };

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        firstName: '',
        email: selectedUser ? selectedUser.email : '',
        lastName: '',
        phone: selectedUser ? selectedUser.phone : '',
        role: selectedUser && selectedUser?.role && selectedUser?.role === 'billing' ? 'billing' : selectedUser?.role === 'operations' ? 'Team Member' : selectedUser?.role === 'admin' ? 'admin' : undefined,
      });
    }
  }, [selectedUser, open]);

  return (
    <Modal
      style={{ textAlign: 'center' }}
      centered
      footer={null}
      title={<p className='text-lg'>{selectedUser ? 'Update Role' : 'Add User'}</p>}
      onCancel={onCancel}
      open={open}
    >
      <Divider />
      <Form
        form={form}
        name='addUser'
        autoComplete='off'
        onFinish={onFinish}
      >
        {!selectedUser && (
          <Form.Item
            name='firstName'
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input className='gap-2 h-11 custom-radius' type='text' placeholder='First Name' />
          </Form.Item>
        )}
        {!selectedUser && (
          <Form.Item
            name='lastName'
            rules={[{ required: true, message: 'Please input your last name!' }]}
          >
            <Input className='gap-2 h-11 custom-radius' type='text' placeholder='Last Name' />
          </Form.Item>
        )}
        {!selectedUser && (
          <Form.Item
            name='phone'
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <PhoneInput
              country={'us'}
              disableDropdown={true}
              inputProps={{
                className: '',
                placeholder: 'Phone Number'
              }}
              containerClass="w-full h-11 custom-radius"
            />
          </Form.Item>
        )}
        <Form.Item
          name='email'
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input className='gap-2 h-11 custom-radius' type='email' placeholder='Email Address' disabled={!!selectedUser} />
        </Form.Item>

        <Form.Item
          name='role'
          rules={[{ required: true, message: 'Please select User Role!' }]}
        >
          <Select
            allowClear
            className='h-11 custom-radius text-left'
            style={{ width: '100%' }}
            size='large'
            placeholder='Select Role'
            options={[
              { value: 'admin', label: 'Super Admin' },
              { value: 'operations', label: 'Team Member' },
              { value: 'billing', label: 'Billings' },
            ]}
          />
        </Form.Item>
        {!selectedUser && (
          <>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  pattern: /^(.{8,})$/,
                  message: 'Password must be at least 8 characters long!',
                },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockIcon />} className='gap-2 h-11 custom-radius' placeholder='Password' type='password' />
            </Form.Item>
            <Form.Item
              name='confirmPassword'
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockIcon />} className='gap-2 h-11 custom-radius' placeholder='Confirm Password' type='password' />
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Button variant='primary' type='submit' className='text-base px-14 h-11 custom-radius'>
            {selectedUser ? 'Update User' : 'Add User'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserManagementAddModal;