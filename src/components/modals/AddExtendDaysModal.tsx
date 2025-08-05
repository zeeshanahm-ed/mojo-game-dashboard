import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Modal, Input, DatePicker, Select, Button, Divider } from 'antd';
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';


const { TextArea } = Input;
// Define the shape of the form data
interface LeadFormData {
    date: dayjs.Dayjs | null;
    desc: string;
    numberOfDays: string | undefined;
}


interface AddExtendDaysModalProps {
    open: boolean;
    onCancel: () => void;
    onAddExtendDays: (formData: LeadFormData) => void;
    editedModalData: any;
    isEdit: boolean;
    handleUpdateExtendDays: (formData: any) => void;
}


const AddExtendDaysModal: React.FC<AddExtendDaysModalProps> = ({ isEdit, onCancel, open, onAddExtendDays, handleUpdateExtendDays, editedModalData }) => {
    // State to manage form data
    const [formData, setFormData] = useState<LeadFormData>({
        date: dayjs(),
        desc: '',
        numberOfDays: '',
    });

    useEffect(() => {
        if (open) {
            if (editedModalData) {
                setFormData(prev => ({
                    ...prev,
                    desc: editedModalData?.description || '',
                    numberOfDays: editedModalData?.numberOfDays || '',
                    date: dayjs(editedModalData?.date) || dayjs(),
                }))
            } else {
                setFormData(prev => ({
                    ...prev,
                    desc: '',
                    numberOfDays: '',
                    date: dayjs(),
                }))
            }
        }
    }, [open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: dayjs.Dayjs | null) => {
        setFormData(prev => ({ ...prev, date }));
    };

    const handlenumberOfDaysChange = (value: string | undefined) => { // Value can be undefined if cleared
        setFormData(prev => ({ ...prev, numberOfDays: value }));
    };


    const handleAddClick = () => {
        if (!formData.date || !formData.desc || !formData.numberOfDays) {
            console.error('Please fill in all required fields.');
            return;
        }
        onAddExtendDays(formData);
        handleCloseModal();
    };
    const handleUpdateClick = () => {
        if (!formData.date || !formData.desc || !formData.numberOfDays) {
            console.error('Please fill in all required fields.');
            return;
        }
        let data = {
            ...editedModalData,
            description: formData.desc,
            numberOfDays: formData.numberOfDays,
            date: dayjs(formData.date)
        }
        handleUpdateExtendDays(data);
        handleCloseModal();
    };

    const resetState = () => {
        setFormData({
            date: dayjs(),
            desc: '',
            numberOfDays: '',
        });
    };
    const handleCloseModal = () => {
        onCancel();
        resetState();
    };

    const NO_OF_DAYS_OPTIONS = Array.from({ length: 10 }, (_, i) => {
        const num = (i + 1) * 5;
        return { value: num.toString(), label: num.toString() };
    });


    return (
        <Modal
            open={open}
            onCancel={handleCloseModal}
            footer={null}
            centered
            width={550}
            title={<p className="text-xl font-semibold text-center">Extend Days</p>}
            className="rounded-lg overflow-hidden"
            styles={{
                header: { borderBottom: 'none', paddingBottom: '0' },
                body: { padding: "8px", paddingTop: "0px" },
                mask: { background: 'rgba(0, 0, 0, 0.6)' },
            }}
        >
            <Divider className="my-4" />

            <div className="space-y-4">
                {/* Date Row */}
                <div className="flex items-center">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4">Date :</label>
                    <div className="flex flex-1 items-center border h-11 custom-radius px-2">
                        <DatePickerIcon className="w-6 h-6 mr-2" />
                        <DatePicker
                            value={formData.date}
                            suffixIcon={null}
                            variant={"borderless"}
                            onChange={handleDateChange}
                            format="MM/DD/YYYY"
                            placeholder='MM/DD/YYYY'
                            className="flex-1 w-full p-2"
                            disabled
                        />
                    </div>
                </div>

                {/* Service Interest Row */}
                <div className="flex items-center">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4">No of Days :</label>
                    <Select
                        value={formData.numberOfDays ? formData.numberOfDays : "0 Days"}
                        onChange={handlenumberOfDaysChange}
                        className="flex-1 h-11 custom-radius"
                        options={NO_OF_DAYS_OPTIONS}
                        placeholder="Select Number of Days"
                    />
                </div>

                {/* Notes Row */}
                <div className="flex items-start">
                    <label className="w-1/3 text-left text-light-gray font-medium pr-4 pt-2">Notes :</label>
                    <div className="flex-1 flex flex-col">
                        <TextArea
                            placeholder='Add Notes'
                            name="desc"
                            value={formData.desc}
                            onChange={handleInputChange}
                            rows={4}
                            className="resize-none border border-border-gray p-2 mb-2 custom-radius"
                        />
                    </div>
                </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-center mt-8">
                <Button
                    disabled={!formData.date || !formData.desc || !formData.numberOfDays}
                    type="primary"
                    onClick={() => { isEdit ? handleUpdateClick() : handleAddClick() }}
                    className="w-50 bg-primary text-white font-bold h-11 custom-radius px-12"
                    size="large"
                >
                    {isEdit ? "Update" : "Extend"}
                </Button>
            </div>
        </Modal>
    );

}

export default AddExtendDaysModal;
