import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Spin } from 'antd';
import PhoneInput from 'react-phone-input-2';
import dayjs from 'dayjs';
import { useHeaderProps } from "components/core/use-header-props";
import useBack from "hooks/use-back";
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
import { useParams } from 'react-router-dom';
import useGetLeadById from '../core/hooks/useGetLeadById';
import useUpdateLead from '../core/hooks/useUpdateLead';
import useServiceType from 'pages/services/core/hooks/serviceType';
import { formatServiceType } from 'helpers/CustomHelpers';
import useCreateClientData from 'pages/clients/core/hooks/useCreateClientData';
import useDeleteLead from '../core/hooks/useDeleteLead';


const { TextArea } = Input;

const LeadDetails: React.FC = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const { leadData, isLoading } = useGetLeadById(leadId);
    const { isUpdateLeadLoading } = useUpdateLead();
    const [form] = Form.useForm();
    const { serviceTypeData } = useServiceType()

    const { setTitle, setBack, } = useHeaderProps();
    const { mutateAsync: createClient } = useCreateClientData();
    const { handleBack } = useBack();
    const { deleteLeadMutate } = useDeleteLead();


    // const [formData, setFormData] = useState<LeadFormData>({
    //     date: null,
    //     clientName: "",
    //     serviceInterest: "",
    //     referralSource: "",
    //     contactNumber: "",
    //     emailAddress: "",
    //     notes: "",
    //     leadStatus: "",
    // });


    useEffect(() => {
        if (leadData && Object.keys(leadData).length > 0) {
            const mappedFormData = {
                date: dayjs(leadData.createdAt),
                clientName: leadData.clientName || "",
                clientId: leadData.clientId || "",
                serviceInterest: leadData.caseType?.name || "",
                referralSource: leadData.source || "",
                contactNumber: leadData.phoneNumber || "",
                emailAddress: leadData.emailAddress || "",
                notes: leadData.notes || "",
                leadStatus: leadData.leadStatus || "",
            };

            form.setFieldsValue(mappedFormData); // ✅ Dynamically update form fields
        }
    }, [leadData, Form]);



    useEffect(() => {
        setTitle('Lead Details');
        setBack(() => handleBack);

        return () => {
            setBack(undefined);
        };
    }, [setTitle, setBack,]);

    // Function to handle changes in form fields
    const handleInputChange = (e: any) => {
        e.preventDefault();
    };

    // Function to handle form submission
    // const onUpdate = (values: LeadFormData) => {
    //     if (values) {
    //         const payload = {
    //             clientName: values?.clientName,
    //             date: dayjs(values?.date),
    //             phoneNumber: values?.contactNumber,
    //             source: values?.referralSource,
    //             emailAddress: values?.emailAddress,
    //             caseType: values?.serviceInterest === leadData.caseType.name ? leadData.caseType._id : values?.serviceInterest,
    //             notes: values?.notes,
    //             leadStatus: values?.leadStatus || "",

    //         };

    //         if (!leadId) {
    //             console.error('Lead ID is missing!');
    //             return;
    //         }
    //         updateLeadMutate(
    //             { id: leadId, body: payload },
    //             {
    //                 onSuccess: async () => {
    //                     showSuccessMessage('Lead update successfully');
    //                     refetchLeadData();
    //                 },
    //                 onError: (error) => {
    //                     showErrorMessage('Error while updating Lead!');
    //                     console.error('Failed to get signed URL', error);
    //                 },
    //             }
    //         );
    //     }
    // };

    const handleLeadDelete = () => {
        deleteLeadMutate(leadData?._id,
            {
                onSuccess: async () => {
                },
                onError: (error) => {
                    console.error('Failed to get signed URL', error);
                },
            }
        );
    };

    // Function to handle form submission
    const onFinish = async (values: any) => {
        // const payload = {
        //     clientName: values?.clientName,
        //     date: dayjs(values?.date),
        //     phoneNumber: values?.contactNumber,
        //     source: values?.referralSource,
        //     emailAddress: values?.emailAddress,
        //     caseType: values?.serviceInterest === leadData.caseType.name ? leadData.caseType._id : values?.serviceInterest,
        //     notes: values?.notes,
        //     leadStatus: values?.leadStatus || "",

        // };
        if (!values) {
            return
        }

        const payload = {
            basicInformation: {
                clientName: values?.clientName,
                clientId: values?.clientId,
                emailAddress: values?.emailAddress,
                phoneNumber: values?.contactNumber,
            },
        };

        try {
            await createClient({ data: payload, id: '' });
            handleLeadDelete();
        } catch (error) {
            console.error('Error adding client:', error);
        }
    };

    // Function to handle form submission failure
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const LEAD_STATUC_OPTIONS = [
        { value: 'NEW', label: 'New' },
        { value: 'CONTECTED', label: 'Contacted' },
        { value: 'NOT_INTERESTED', label: 'Not Interested' },
        { value: 'READY_tO_CONVERT', label: 'Ready to Convert' },
        { value: 'CONVERTED', label: 'Converted' },
        { value: 'LEAD_COMPLETEd', label: 'Lead Completed' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'PANDING', label: 'Pending' },
    ];

    return (
        <section className="">
            {isLoading ?
                <div className='flex justify-center items-center h-32'>
                    <Spin size="large" />
                </div>
                :
                <div>
                    {/*Form*/}
                    <Form
                        form={form}
                        layout="vertical"
                        onValuesChange={handleInputChange}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 custom-style-form"
                    >
                        {/* Date Picker Field */}
                        <Form.Item
                            label={<span className="font-medium text-light-gray">Date :</span>}
                            name="date"
                            rules={[{ required: true, message: "Please select a date!" }]}
                            className="col-span-1"
                            required={false}
                        >
                            <DatePicker
                                suffixIcon={<DatePickerIcon className="w-5 h-5 text-gray-500" />}
                                format="MM/DD/YYYY"
                                placeholder="Select date"
                                className="w-full h-11 custom-radius"
                                showTime={false}
                            />
                        </Form.Item>

                        {/* Client Name Input Field */}
                        <Form.Item
                            label={<span className="w-full font-medium text-light-gray">Client Name :</span>}
                            name="clientName"
                            rules={[{ required: true, message: 'Please enter client name!' }]}
                            className="col-span-1"
                            required={false}
                        >
                            <Input
                                className="custom-radius h-11"
                            />
                        </Form.Item>

                        {/* Client Id Input Field */}
                        <Form.Item
                            label={<span className="w-full font-medium text-light-gray">Client Id :</span>}
                            name="clientId"
                            rules={[{ required: true, message: 'Please enter client id!' }]}
                            className="col-span-1"
                            required={false}
                        >
                            <Input
                                className="custom-radius h-11"
                            />
                        </Form.Item>

                        {/* Service Interest Select Field */}
                        <Form.Item
                            label={<span className="font-medium text-light-gray">Service Interest :</span>}
                            name="serviceInterest"
                            rules={[{ required: true, message: 'Please select service interest!' }]}
                            className="col-span-1 "
                            required={false}
                        >
                            <Select
                                placeholder="Select service interest"
                                className="custom-radius h-11"
                                options={formatServiceType(serviceTypeData?.data)}
                            >
                            </Select>
                        </Form.Item>

                        {/* Referral Source Input Field */}
                        <Form.Item
                            label={<span className="font-medium text-light-gray">Referral Source :</span>}
                            name="referralSource"
                            className="col-span-1"
                        >
                            <Input
                                className="custom-radius h-11"
                            />
                        </Form.Item>

                        {/* Contact Number Input Field */}
                        <Form.Item
                            label={<span className="font-medium text-light-gray">Contact Number :</span>}
                            name="contactNumber"
                            className="col-span-1"
                            required={false}
                            rules={[{ required: true, message: 'Please enter contact number!' }]}
                        >
                            <PhoneInput
                                country={'us'}
                                disableDropdown={true}
                                inputProps={{
                                    className: ''
                                }}
                                containerClass="w-full h-11 custom-radius"
                            />
                        </Form.Item>

                        {/* Email Address Input Field */}
                        <Form.Item
                            label={<span className="font-medium text-light-gray">Email Address :</span>}
                            name="emailAddress"
                            rules={[{ required: true, message: 'Please enter email address!', type: 'email' }]}
                            className="col-span-1"
                            required={false}
                        >
                            <Input
                                className="custom-radius h-11"
                            />
                        </Form.Item>

                        {/* Notes TextArea Field */}
                        <Form.Item
                            label={<span className="font-medium text-light-gray">Notes :</span>}
                            name="notes"
                            className="col-span-full lead-details-textArea"
                        >
                            <TextArea
                                rows={3}
                                className="custom-radius resize-none"
                            />
                        </Form.Item>

                        {/* Lead Status Select Field */}
                        <Form.Item
                            label={<span className="font-medium text-light-gray">Lead Status :</span>}
                            name="leadStatus"
                            rules={[{ required: true, message: 'Please select lead status!' }]}
                            className="col-span-1"
                            required={false}
                        >
                            <Select
                                disabled={false}
                                placeholder="Select lead status"
                                className="custom-radius h-11"
                                options={LEAD_STATUC_OPTIONS}
                            >
                            </Select>
                        </Form.Item>

                        {/* Convert to Client Button */}
                        <Form.Item className="md:col-span-1 flex justify-end items-end convert-to-client-btn">
                            <Button
                                disabled={isUpdateLeadLoading}
                                type="primary"
                                htmlType="submit"
                                className="bg-secondary w-60 text-white h-11 px-6 custom-radius shadow-none font-medium"
                            >
                                {isUpdateLeadLoading ? <Spin className="custom-spin" /> : "Convert to Client"}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>}
        </section>
    );
};

export default LeadDetails;