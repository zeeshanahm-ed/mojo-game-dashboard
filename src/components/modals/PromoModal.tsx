
import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Radio, DatePicker, Button, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PromoCodeRecord } from 'utils/Interfaces';
import NumericStepper from 'components/core-ui/numaric-stepper/NumericStepper';
//icons
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
import { FiChevronDown } from "react-icons/fi";

const { Option } = Select;
const { RangePicker } = DatePicker;


interface PromoModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: PromoCodeRecord) => void;
    editData?: PromoCodeRecord | null;
    loading?: boolean;
}
// Promo code options
const promoCodeOptions = [
    'FD13D20',
    'SAVE20',
    'DISCOUNT15',
    'WELCOME10',
    'FIRST25'
];

// Custom users options (mock data)
const customUserOptions = [
    { label: 'John Doe', value: 'john_doe' },
    { label: 'Jane Smith', value: 'jane_smith' },
    { label: 'Mike Johnson', value: 'mike_johnson' },
    { label: 'Sarah Wilson', value: 'sarah_wilson' }
];

const PromoModal: React.FC<PromoModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    editData = null,
    loading = false
}) => {
    const [form] = Form.useForm();
    const [assignTo, setAssignTo] = useState<'all' | 'custom'>('all');
    const isEdit = !!editData;
    const [formState, setFormState] = useState<any>({
        promoCode: "",
        percentage: 0,
        usageLimit: 0,
        assignTo: "all",
        customUsers: [],
        discountDuration: [dayjs(), dayjs()],
    });


    useEffect(() => {
        if (visible) {
            if (editData) {
                setFormState({
                    promoCode: editData.promoCode,
                    percentage: editData.percentage,
                    usageLimit: editData.usageLimit,
                    assignTo: editData.assignTo,
                    customUsers: editData.customUsers || [],
                    discountDuration: [
                        dayjs(editData.discountDuration.startDate),
                        dayjs(editData.discountDuration.endDate),
                    ],
                });
            } else {
                // Reset to defaults
                setFormState({
                    promoCode: "",
                    percentage: 0,
                    usageLimit: 0,
                    assignTo: "all",
                    customUsers: [],
                    discountDuration: [dayjs(), dayjs()],
                });
            }
        }
    }, [visible, editData]);

    const handleSubmit = () => {

    };

    const handleCancel = () => {
        form.resetFields();
        setAssignTo('all');
        onCancel();
    };

    return (
        <Modal
            open={visible}
            onCancel={handleCancel}
            title={<p className='font-normal text-2xl'>{isEdit ? 'Edit Promo' : 'Add new Promo'}</p>}
            width={650}
            footer={null}
            centered
            closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}
        >
            <Divider />
            <div className="">
                <div className="flex items-center justify-between gap-4">
                    {/* Promo Code */}
                    <div className='flex-1'>
                        <label className="text-lg ">Promo Code</label>
                        <Select
                            placeholder="Select promo code"
                            className="h-12 w-full"
                            suffixIcon={<FiChevronDown size={18} />}
                        >
                            {promoCodeOptions.map(code => (
                                <Option key={code} value={code}>{code}</Option>
                            ))}
                        </Select>
                    </div>

                    {/* Percentage */}
                    <div>
                        <label className="text-lg">Percentage</label>
                        <NumericStepper
                            initialValue={2}
                            min={5}
                            max={100}
                            step={1}
                            onChange={(value) => console.log("Percentage:", value)}
                            formatter={(v) => `${v} %`}
                        />
                    </div>

                    {/* Usage Limit */}
                    <div>
                        <label className="text-lg">Usage Limit</label>
                        <NumericStepper
                            initialValue={2}
                            min={5}
                            step={1}
                            onChange={(value) => console.log("Usage Limit:", value)}
                            formatter={(v) => `${v} times`}
                        />
                    </div>
                </div>

                {/* Assign Promo Code */}
                <div className="mt-5">
                    <label className="block text-lg mb-3">
                        Assign promo code
                    </label>
                    <div className="mb-0">
                        <Radio.Group
                            value={assignTo}
                            onChange={(e) => setAssignTo(e.target.value)}
                            className="w-full"
                        >
                            <div className="flex items-center gap-6">
                                <Radio value="all" className="text-base">All users</Radio>

                                <div className="flex items-center gap-3 flex-1">
                                    <Radio value="custom" className="text-base">Custom users</Radio>
                                    {assignTo === 'custom' && (
                                        <div className="mb-0 flex-1">
                                            <Select
                                                mode="multiple"
                                                placeholder="Select users"
                                                className="h-12 overflow-hidden overflow-y-auto"
                                                suffixIcon={<FiChevronDown size={18} />}
                                            >
                                                {customUserOptions.map(user => (
                                                    <Option key={user.value} value={user.value}>
                                                        {user.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Radio.Group>
                    </div>
                </div>

                {/* Discount Duration */}
                <div className="mt-10 w-1/2">
                    <div>
                        <label className="text-lg">Discount Duration</label>
                        <RangePicker
                            prefix={<DatePickerIcon className="w-6 h-6 mr-2" />}
                            className="w-full h-12"
                            suffixIcon={<FiChevronDown size={18} />}
                            format="DD MMM"
                            placeholder={['Start Date', 'End Date']}
                            separator="-"
                            allowClear={false}
                        />
                    </div>
                </div>
                <Divider />

                {/* Submit Button */}
                <div className="flex justify-end mt-2">
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={loading}
                        className="bg-blue-500 hover:bg-blue-600 border-blue-500 h-12 px-8 text-base font-medium"
                    >
                        {isEdit ? 'Update Promo' : 'Add Promo'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PromoModal;