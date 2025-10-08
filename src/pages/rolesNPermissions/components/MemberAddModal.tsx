import { useEffect } from 'react';
//components
import { Divider, Form, Modal, Select, Input, Radio } from 'antd';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
//hooks & Utils
import { ROLES_OPTIONS } from 'constants/global';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import { AddUserParams } from '../core/_models';
import useAddMember from '../core/hooks/useAddMember';
import useUpdateMember from '../core/hooks/useUpdateMember';
//icons
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';

interface MemberAddModalProps {
    onCancel: () => void;
    refetchAllUserData: () => void;
    open: boolean;
    EditUserData: any;
}

function MemberAddModal({ onCancel, open, EditUserData, refetchAllUserData }: MemberAddModalProps) {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const direction = useDirection();
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
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
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
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
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
            centered
            footer={null}
            title={<p className='font-normal text-2xl'>{EditUserData ? t('Edit Member') : t('Add New Member')}</p>}
            onCancel={onCancel}
            open={open}
            className={`${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
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
                    label={t('First Name')}
                    rules={[{ required: true, message: t('Please input your first name') }]}
                >
                    <Input className={`gap-2 h-12 `} type='text' placeholder={t('First Name')} />
                </Form.Item>

                <Form.Item
                    name='lastName'
                    label={t('Last Name')}
                    rules={[{ required: true, message: t('Please input your last name') }]}
                >
                    <Input className={`gap-2 h-12 `} type='text' placeholder={t('Last Name')} />
                </Form.Item>

                <div className='flex justify-between items-center gap-x-5'>
                    <Form.Item
                        name='age'
                        label={t('Age')}
                        rules={[{ required: true, message: t('Please input your age') }]}
                    >
                        <Input className={`gap-2 h-12 `} type='number' placeholder={t('Age')} />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label={t('Gender')}
                    >
                        <Radio.Group className='flex items-center gap-x-2'>
                            <Radio value='male'>{t('Male')}</Radio>
                            <Radio value='female'>{t('Female')}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </div>

                <Form.Item
                    name='email'
                    label={t('Email Address')}
                    rules={[{ required: true, message: t('Please input your email') }]}
                >
                    <Input className={`gap-2 h-12 `} type='email' placeholder={t('Email Address')} disabled={!!EditUserData} />
                </Form.Item>

                <Form.Item
                    name='phoneNumber'
                    label={t('Phone Number')}
                    rules={[{ required: true, message: t('Please input your phone number') }]}
                >
                    <Input className={`gap-2 h-12 `} type='text' placeholder={t('Phone Number')} />
                </Form.Item>

                <Form.Item
                    name='role'
                    label={t('User Role')}
                    rules={[{ required: true, message: t('Please select User Role') }]}
                >
                    <Select
                        allowClear={false}
                        className={`h-12 text-left `}
                        style={{ width: '100%' }}
                        size='large'
                        placeholder={t('Select User Role')}
                        options={ROLES_OPTIONS}
                    />
                </Form.Item>

                {!EditUserData &&
                    <Form.Item
                        label={t('Password')}
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: t('Please input your password'),
                            },
                            {
                                pattern: /^(.{8,})$/,
                                message: t('Password must be at least 8 characters long'),
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password className={`h-12 `} placeholder={t('Password')} type='password' />
                    </Form.Item>}

                <div className='flex justify-end'>
                    <button type='submit' className={`text-base px-10 h-12 bg-primary text-white rounded-md w-fit `}>
                        {EditUserData ? t('Save Changes') : t('Add Member')}
                    </button>
                </div>

            </Form>
        </Modal >
    );
}

export default MemberAddModal;