import React, { useState } from 'react';
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Modal, Input, DatePicker, Select, Button, Divider, Spin, Typography } from 'antd';
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useCreateLead from 'pages/leads/core/hooks/useCreateLead';
import { formatServiceType } from 'helpers/CustomHelpers';


const { TextArea } = Input;
// Define the shape of the form data
interface LeadFormData {
    date: dayjs.Dayjs | null;
    clientName: string;
    clientId: string;
    contactNumber: string;
    referralSource: string;
    emailAddress: string;
    serviceInterest: string | undefined;
    notes: string;
}


interface AddLeadModalProps {
    open: boolean;
    onCancel: () => void;
    refetchLeadData: () => void;
    serviceTypeData: any;
}

interface ValidationErrors {
    [key: string]: string;
}


const AddLeadmodal: React.FC<AddLeadModalProps> = ({ onCancel, open, refetchLeadData, serviceTypeData }) => {

    const { createLeadMutate, isCreateLeadLoading } = useCreateLead();
    const [formErrors, setFormErrors] = useState<ValidationErrors>()


    // State to manage form data
    const [formData, setFormData] = useState<LeadFormData>({
        date: dayjs(),
        clientName: '',
        contactNumber: '',
        clientId: '',
        referralSource: '',
        emailAddress: '',
        serviceInterest: undefined,
        notes: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors((prev: any) => ({ ...prev, [name]: "" }))

    };

    const handleDateChange = (date: dayjs.Dayjs | null) => {
        setFormData(prev => ({ ...prev, date }));
    };

    const handleServiceInterestChange = (value: string | undefined) => { // Value can be undefined if cleared
        setFormData(prev => ({ ...prev, serviceInterest: value }));
        setFormErrors((prev: any) => ({ ...prev, serviceInterest: "" }))
    };


    const handleAddClick = () => {
        let error = validateFormData(formData)
        if (Object.keys(error).length > 0) {
            setFormErrors(error)
            return;
        } else {
            handleOk(formData);
            handleCloseModal();
        }
    };

    const resetState = () => {
        setFormData({
            date: dayjs(),
            clientName: '',
            clientId: '',
            contactNumber: '',
            referralSource: '',
            emailAddress: '',
            serviceInterest: '',
            notes: '',
        });
        setFormErrors({})
    };
    const handleCloseModal = () => {
        onCancel();
        resetState();
    };

    const handleOk = (data: any) => {
        if (data) {
            const payload = {
                clientName: data?.clientName,
                clientId: data?.clientId,
                date: dayjs(data?.date),
                phoneNumber: data?.contactNumber,
                source: data?.referralSource,
                emailAddress: data?.emailAddress,
                caseType: data?.serviceInterest,
                notes: data?.notes
            };

            createLeadMutate(payload, {
                onSuccess: async () => {
                    showSuccessMessage('Lead add successfully');
                    refetchLeadData();
                    handleCloseModal();
                },
                onError: (error) => {
                    showErrorMessage('Error while adding Lead!');
                    console.error('Failed to get signed URL', error);
                },
            });
        }
    };

    const validateFormData = (formData: LeadFormData): ValidationErrors => {
        const errors: ValidationErrors = {};

        if (!formData.clientName.trim()) {
            errors.clientName = 'Client name is required.';
        }
        if (!formData.contactNumber.trim()) {
            errors.contactNumber = 'Contact number is required.';
        }
        if (!formData.clientId.trim()) {
            errors.clientId = 'Client id is required.';
        }
        // } else if (!/^\d{10,15}$/.test(formData.contactNumber)) {
        //     errors.contactNumber = 'Contact number must be 10–15 digits.';
        // }
        if (!formData.emailAddress.trim()) {
            errors.emailAddress = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
            errors.emailAddress = 'Invalid email format.';
        }
        if (!formData.serviceInterest) {
            errors.serviceInterest = 'Service interest is required.';
        }

        return errors;
    };

    const handleChangeContactNumber = (e: any) => {
        setFormData(prev => ({ ...prev, ["contactNumber"]: e }));
        setFormErrors((prev: any) => ({ ...prev, ["contactNumber"]: "" }))
    };

    return (
        <Modal
            open={open}
            onCancel={handleCloseModal}
            footer={null}
            centered
            width={550}
            title={<p className="text-xl font-semibold text-center">Add a Lead</p>}
            className="rounded-lg overflow-hidden"
            styles={{
                header: { borderBottom: 'none', paddingBottom: '0' },
                body: { padding: "8px", paddingTop: "0px" },
                mask: { background: 'rgba(0, 0, 0, 0.6)' },
            }}
        >
            <Divider className="my-4" /> {/* Separator below the title */}

            <div className="space-y-4"> {/* Vertical spacing between form rows */}
                {/* Date Row */}
                <div className="flex items-center">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4">Date :</label>
                    <div className="flex flex-1 items-center border custom-radius px-2 h-11">
                        <DatePickerIcon className="w-6 h-6 mr-2" />
                        <DatePicker
                            value={formData.date}
                            suffixIcon={null}
                            variant={"borderless"}
                            onChange={handleDateChange}
                            format="MM/DD/YYYY"
                            placeholder='MM/DD/YYYY'
                            className="flex-1 w-full p-2 custom-radius"
                        />
                    </div>
                </div>

                {/* Client Id Row */}
                <div className="flex items-center">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4">Client Id :</label>
                    <Input
                        name="clientId"
                        type='number'
                        placeholder='Client Id'
                        value={formData.clientId}
                        onChange={handleInputChange}
                        className="flex-1 custom-radius border border-border-gray  p-2"
                    />
                </div>
                <div >{formErrors && (<Typography.Text type="danger" className="text-red-500">{formErrors.clientId}</Typography.Text>)} </div>

                {/* Client Name Row */}
                <div className="flex items-center">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4">Client Name :</label>
                    <Input
                        name="clientName"
                        placeholder='Client Name'
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className="flex-1 custom-radius border border-border-gray  p-2"
                    />
                </div>
                <div >{formErrors && (<Typography.Text type="danger" className="text-red-500">{formErrors.clientName}</Typography.Text>)} </div>

                {/* Contact Number Row */}
                <div className="flex items-center">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4">Contact Number :</label>
                    {/* <Input
                        name="contactNumber"
                        placeholder='Contact Number'
                        value={formData.contactNumber}
                        onChange={handleChangeContactNumber}
                        autoComplete="off"
                        className="flex-1 custom-radius border border-border-gray  p-2"
                    /> */}
                    <PhoneInput
                        country={'us'}
                        value={formData.contactNumber}
                        onChange={(e) => handleChangeContactNumber(e)}
                        onlyCountries={['us']}
                        disableDropdown={true}
                        enableSearch={false}
                    />
                </div>
                <div >{formErrors && (<Typography.Text type="danger" className="text-red-500">{formErrors.contactNumber}</Typography.Text>)} </div>


                {/* Referral Source Row */}
                <div className="flex items-center">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4">Referral Source :</label>
                    <Input
                        placeholder='Referral Source'
                        name="referralSource"
                        value={formData.referralSource}
                        onChange={handleInputChange}
                        className="flex-1 custom-radius border border-border-gray  p-2"
                    />
                </div>

                {/* Email Address Row */}
                <div className="flex items-center">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4">Email Address :</label>
                    <Input
                        type='email'
                        placeholder='example@gmail.com'
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        className="flex-1 custom-radius border border-border-gray  p-2"
                    />
                </div>
                <div >{formErrors && (<Typography.Text type="danger" className="text-red-500">{formErrors.emailAddress}</Typography.Text>)} </div>


                {/* Service Interest Row */}
                <div className="flex items-center">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4">Service Interest :</label>
                    <Select
                        value={formData.serviceInterest}
                        onChange={handleServiceInterestChange}
                        className="flex-1 custom-radius h-11 "
                        placeholder="Select Service Interest"
                        options={formatServiceType(serviceTypeData?.data)}
                    />
                </div>
                <div >{formErrors && (<Typography.Text type="danger" className="text-red-500">{formErrors.serviceInterest}</Typography.Text>)} </div>


                {/* Notes Row */}
                <div className="flex items-start">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4 pt-2">Notes :</label>
                    <div className="flex-1 flex flex-col">
                        <TextArea
                            placeholder='Add Notes'
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={4}
                            className="resize-none custom-radius border border-border-gray  p-2 mb-2"
                        />
                    </div>
                </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-center mt-8">
                <Button
                    type="primary"
                    onClick={handleAddClick}
                    className="w-50 bg-primary text-white font-bold py-2 px-12 custom-radius"
                    size="large"
                >
                    {isCreateLeadLoading ? <Spin className="custom-spin" /> : "Add"}
                </Button>
            </div>
        </Modal>
    );

}

export default AddLeadmodal;
