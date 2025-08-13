import { useEffect } from 'react';
//components
import { Divider, Form, Modal, Select, Input, Radio } from 'antd';
import Button from 'components/core-ui/button/button';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
//hooks & Utils
import { ROLES_OPTIONS } from 'constants/global';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import { AddUserParams } from '../core/_models';
import useAddMember from '../core/hooks/useAddMember';
import useUpdateMember from '../core/hooks/useUpdateMember';
//icons
import LockIcon from '../../../assets/icons/lock.svg?react';
import { CloseOutlined } from '@ant-design/icons';

interface MemberAddModalProps {
    onCancel: () => void;
    refetchAllUserData: () => void;
    open: boolean;
    EditUserData: any;
}

function MemberAddModal({ onCancel, open, EditUserData, refetchAllUserData }: MemberAddModalProps) {
    const [form] = Form.useForm();
    const { addMemberMutate, isAddMemberLoading } = useAddMember();
    const { updateMemberMutate, isUpdateMemberLoading } = useUpdateMember();

    const onFinish = (values: AddUserParams) => {
        if (EditUserData) {
            handleUpdateAddMember(values);
        } else {
            handleAddMember(values);
        }
    };

    const handleAddMember = (values: AddUserParams) => {
        const payload = {
            ...values
        }

        addMemberMutate(payload, {
            onSuccess: (res) => {
                showSuccessMessage(res?.message);
                refetchAllUserData();
                onCancel();
            },
            onError: () => {
                showErrorMessage("An error occurred while adding the user.");
            },
        });
    };

    const handleUpdateAddMember = (values: AddUserParams) => {
        const payload = {
            ...values
        }

        updateMemberMutate({ body: payload, id: EditUserData?._id }, {
            onSuccess: (res) => {
                showSuccessMessage(res?.message);
                refetchAllUserData();
                onCancel();
            },
            onError: () => {
                showErrorMessage("An error occurred while updating the user.");
            },
        });
    }

    useEffect(() => {
        if (open) {
            form.resetFields();
            if (EditUserData) {
                form.setFieldsValue({
                    firstName: EditUserData?.firstName,
                    email: EditUserData?.email,
                    lastName: EditUserData?.lastName,
                    phoneNumber: EditUserData?.phoneNumber,
                    role: EditUserData?.role,
                    age: EditUserData?.age,
                    gender: EditUserData?.gender,
                    password: EditUserData?.password,
                });
            }
        }
    }, [EditUserData, open]);

    return (
        <Modal
            style={{ textAlign: 'center' }}
            centered
            footer={null}
            title={<p className='font-normal text-2xl'>{EditUserData ? 'Edit member' : 'Add new member'}</p>}
            onCancel={onCancel}
            open={open}
            closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}

        >
            {isAddMemberLoading || isUpdateMemberLoading ? <FallbackLoader isModal={true} /> : null}
            <Divider />
            <Form
                form={form}
                name={EditUserData ? 'editMember' : 'asddMember'}
                layout='vertical'
                autoComplete='off'
                onFinish={onFinish}
            >

                <Form.Item
                    name='firstName'
                    label='First Name'
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                    <Input className='gap-2 h-12 ' type='text' placeholder='First Name' />
                </Form.Item>

                <Form.Item
                    name='lastName'
                    label='Last Name'
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                    <Input className='gap-2 h-12 ' type='text' placeholder='Last Name' />
                </Form.Item>

                <div className='flex justify-between items-center'>
                    <Form.Item
                        name='age'
                        label='Age'
                        rules={[{ required: true, message: 'Please input your age!' }]}
                    >
                        <Input className='gap-2 h-12 ' type='number' placeholder='Age' />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Gender"
                    >
                        <Radio.Group>
                            <Radio value='male'>Male</Radio>
                            <Radio value='female'>Female</Radio>
                        </Radio.Group>
                    </Form.Item>
                </div>

                <Form.Item
                    name='email'
                    label='Email Address'
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input className='gap-2 h-12 ' type='email' placeholder='Email Address' disabled={!!EditUserData} />
                </Form.Item>

                <Form.Item
                    name='phoneNumber'
                    label='Phone Number'
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    <Input className='gap-2 h-12 ' type='text' placeholder='Phone Number' />
                </Form.Item>

                <Form.Item
                    name='role'
                    label='User Role'
                    rules={[{ required: true, message: 'Please select User Role!' }]}
                >
                    <Select
                        allowClear={false}
                        className='h-12 text-left'
                        style={{ width: '100%' }}
                        size='large'
                        placeholder='Select Role'
                        options={ROLES_OPTIONS}
                    />
                </Form.Item>

                {!EditUserData &&
                    <Form.Item
                        label='Password'
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
                        <Input.Password prefix={<LockIcon />} className='gap-2 h-12 ' placeholder='Password' type='password' />
                    </Form.Item>}

                <div className='flex justify-end'>
                    <Button variant='primary' type='submit' className='text-base px-14 h-12 '>
                        {EditUserData ? 'Save Changes' : 'Add Member'}
                    </Button>
                </div>

            </Form>
        </Modal >
    );
}

export default MemberAddModal;