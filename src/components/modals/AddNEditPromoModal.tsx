
import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Radio, DatePicker, Button, Divider, Input, Tag } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { PromoCodeRecord } from 'utils/Interfaces';
import NumericStepper from 'components/core-ui/numaric-stepper/NumericStepper';
//icons
import DateIcon from 'assets/icons/date-icon.svg?react';
import { CloseOutlined } from '@ant-design/icons';
import { FiChevronDown } from "react-icons/fi";
import useAddPromoCode from 'pages/promo-code-management/core/hooks/useAddPromoCode';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';

const { Option } = Select;
const { RangePicker } = DatePicker;


interface PromoModalProps {
    open: boolean;
    onClose: () => void;
    editData?: PromoCodeRecord | null;
    refetchPromoData: () => void;
}

interface FormState {
    promoCode: string;
    percentage: number;
    usageLimit: number;
    assignTo: 'all' | 'custom';
    customUsers: string[];
    discountDuration: [Dayjs, Dayjs];
}

// Custom users options (mock data)
const customUserOptions = [
    { label: 'John Doe', value: 'john_doe' },
    { label: 'Jane Smith', value: 'jane_smith' },
    { label: 'Mike Johnson', value: 'mike_johnson' },
    { label: 'Sarah Wilson', value: 'sarah_wilson' }
];


const AddNEditPromoModal: React.FC<PromoModalProps> = ({
    open,
    onClose,
    editData = null,
    refetchPromoData,
}) => {
    const { addPromoCodeMutate, isLoading } = useAddPromoCode();
    const [assignTo, setAssignTo] = useState<'all' | 'custom'>('all');
    const isEdit = !!editData;
    const [formState, setFormState] = useState<FormState>({
        promoCode: "",
        percentage: 0,
        usageLimit: 0,
        assignTo: "all",
        customUsers: [],
        discountDuration: [dayjs(), dayjs()],
    });


    useEffect(() => {
        if (open) {
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
                    percentage: 5,
                    usageLimit: 5,
                    assignTo: "all",
                    customUsers: [],
                    discountDuration: [dayjs(), dayjs()],
                });
            }
        }
    }, [open, editData]);

    const handleAddPromoCode = () => {
        const body = {
            code: formState.promoCode,
            percentage: formState.percentage,
            usageLimit: formState.usageLimit,
            assignedUsers: [],
            validFrom: formState.discountDuration[0].toISOString(),
            validUntil: formState.discountDuration[1].toISOString(),
        }
        addPromoCodeMutate(body, {
            onSuccess: () => {
                showSuccessMessage('Promo code added successfully.');
                refetchPromoData();
            },
            onError: () => {
                showErrorMessage('Failed to add promo code.');
            },
        })

    };

    const handleCancel = () => {
        setAssignTo('all');
        resetState();
        onClose();
    };

    const resetState = () => {
        setFormState({
            promoCode: "",
            percentage: 5,
            usageLimit: 5,
            assignTo: "all",
            customUsers: [],
            discountDuration: [dayjs(), dayjs()],
        });
    };

    const handleSelectChange = (value: string | number, field: keyof FormState) => {
        setFormState(prev => ({ ...prev, [field]: value }))
    };

    const handleDiscountDurationChange = (date: any) => {
        setFormState(prev => ({ ...prev, discountDuration: [date?.[0] as Dayjs, date?.[1] as Dayjs] }))
    };

    const tagRender = (props: any) => {
        const { label, closable, onClose } = props;
        return (
            <Tag
                closable={closable}
                onClose={onClose}
                className={`text-black text-base p-1 m-1 border-0`}
            >
                {label}
            </Tag>
        );
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            title={<p className='font-normal text-2xl'>{isEdit ? 'Edit Promo' : 'Add new Promo'}</p>}
            width={650}
            footer={null}
            centered
            closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}
        >
            <Divider />
            {isLoading && <FallbackLoader isModal={true} />}
            <div className="">
                <div className="flex items-center justify-between gap-4">
                    {/* Promo Code */}
                    <div className='flex-1'>
                        <label className="text-lg ">Promo Code</label>
                        <Input
                            placeholder="Enter promo code"
                            className="h-12 w-full"
                            value={formState.promoCode}
                            onChange={(e) => handleSelectChange(e.target.value, "promoCode")}
                        />
                    </div>

                    {/* Percentage */}
                    <div>
                        <label className="text-lg">Percentage</label>
                        <NumericStepper
                            initialValue={5}
                            min={5}
                            max={100}
                            step={5}
                            onChange={(value) => handleSelectChange(value, "percentage")}
                            formatter={(v) => `${v} %`}
                        />
                    </div>

                    {/* Usage Limit */}
                    <div>
                        <label className="text-lg">Usage Limit</label>
                        <NumericStepper
                            initialValue={5}
                            min={5}
                            step={5}
                            onChange={(value) => handleSelectChange(value, "usageLimit")}
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
                                                size='large'
                                                className='h-full text-center'
                                                mode='tags'
                                                allowClear
                                                tagRender={tagRender}
                                                style={{ width: '100%' }}
                                                placeholder='Add custom users'
                                                options={customUserOptions}
                                                onChange={(value) => {
                                                    handleSelectChange(value, "customUsers");
                                                }}
                                            />
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
                            prefix={<DateIcon className="w-6 h-6 mr-2" />}
                            className="w-full h-12"
                            suffixIcon={<FiChevronDown size={18} />}
                            format="DD MMM"
                            placeholder={['Start Date', 'End Date']}
                            separator="-"
                            allowClear={false}
                            value={formState.discountDuration}
                            onChange={(value) => handleDiscountDurationChange(value)}
                        />
                    </div>
                </div>
                <Divider />

                {/* Submit Button */}
                <div className="flex justify-end mt-2">
                    <Button
                        type="primary"
                        onClick={handleAddPromoCode}
                        className="bg-blue-500 hover:bg-blue-600 border-blue-500 h-12 px-8 text-base font-medium"
                    >
                        {isEdit ? 'Update Promo' : 'Add Promo'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AddNEditPromoModal;