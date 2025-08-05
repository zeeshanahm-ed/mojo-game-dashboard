/* eslint-disable react/no-array-index-key */
import { useState } from 'react';

import moment from 'moment';
//components
import { Avatar, Popconfirm, Button } from 'antd';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
//icons
import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';

import { RiErrorWarningLine } from "react-icons/ri";

//Hooks and Modals
import { CaseDocument } from '../core/_modals';
import useCaseDataDelete from '../core/hooks/useCaseDataDelete';
import useCreateCase from '../core/hooks/useCreateCase';
import AddExtendDaysModal from 'components/modals/AddExtendDaysModal';
import dayjs from 'dayjs';
import useDeleteSingleDocument from '../core/hooks/useDeleteSingleDocument';
import { useHandleIJPDates } from 'store/IJP_Dates';

interface DocumentEntriesProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    serviceData: any;
    phase: any;
    caseDataType: any;
    caseDataSubType: any;
    refetchCaseData: any;
    refetchServiceData: any;
    caseDocumentData: any;
}
function Extensions({
    phase,
    serviceData,
    caseDataType,
    caseDataSubType,
    refetchCaseData,
    refetchServiceData,
    caseDocumentData,
    description,
}: DocumentEntriesProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedModalData, setEditedModalData] = useState("");
    const [isEditModal, setIsEditModal] = useState(false);
    const { createCaseMutate } = useCreateCase();
    const { deleteCaseData, isDeletingCase } = useCaseDataDelete();
    const { deleteSingleDocument } = useDeleteSingleDocument();

    const [showMoreDescription, setShowMoreDescription] = useState<{ showMoreDesId: string | number; show: boolean; less: boolean }>({
        showMoreDesId: "",
        show: false,
        less: false
    });

    const { jobSearchEndDate, jobHiringLastDate } = useHandleIJPDates();

    const showModal = (data: any, type: string) => {
        setIsModalOpen(true);
        if (type === 'edit') {
            setIsEditModal(true);
        } else {
            setIsEditModal(false);
        }

        // Determine the date to use based on priority
        const getDateForModal = (): any => {
            if (jobSearchEndDate && jobHiringLastDate) {
                return jobHiringLastDate;
            }

            if (jobSearchEndDate) {
                return jobSearchEndDate;
            }

            return dayjs();
        };

        // Set modal data with the determined date
        const modalData = {
            ...data,
            date: getDateForModal(),
        };

        setEditedModalData(modalData);
    };


    const handleAddExtensions = ({ desc, date, numberOfDays }: any) => {
        if (desc) {
            const clientServiceData = {
                client: serviceData?.data?.client?._id,
                case: serviceData?.data?._id,
                caseDataType: caseDataType,
                caseDataSubType: caseDataSubType,
                phase: phase,
            };
            const caseData = {
                ...clientServiceData,
                description: desc,
                date: dayjs(date),
                numberOfDays: numberOfDays
            };
            createCaseMutate(caseData, {
                onSuccess: async () => {
                    showSuccessMessage('Extensions added successfully');
                    refetchCaseData();
                    refetchServiceData();
                    setIsModalOpen(false);
                },
                onError: (error) => {
                    showErrorMessage('Error while adding Extensions!');
                    console.error('Failed to get signed URL', error);
                },
            });
        }
    };

    const handleUpdateExtendDays = (editData: any) => {
        if (editData) {
            deleteSingleDocument(
                { id: editData._id || '', body: editData },
                {
                    onSuccess: () => {
                        refetchCaseData();
                        refetchServiceData();
                        showSuccessMessage('Updated Successfully!');
                        handleCancel()
                    },
                    onError: (error) => {
                        console.error('Update error', error);
                        showErrorMessage('Error while updating!');
                        handleCancel();
                    },
                }
            );
        }
    };

    const handleRemoveEntry = (documentId: string) => {
        deleteCaseData(documentId, {
            onSuccess: () => {
                refetchCaseData();
                showSuccessMessage('Deleted Successfully!');
            },
            onError: (error) => {
                console.error('Delete error', error);
                showErrorMessage('Error while deleting!');
            },
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditedModalData('');
    };

    const handleViewLess = (index: number) => {
        setShowMoreDescription({
            showMoreDesId: index,
            show: false,
            less: true
        });
    };
    const handleViewMore = (index: number) => {
        setShowMoreDescription({
            showMoreDesId: index,
            show: true,
            less: false
        })
    };

    return (
        <section>
            <div className='flex justify-between items-center'>
                <Button variant='text' className='bg-secondary shadow-none text-white text-sm gap-3 h-11 custom-radius px-8 font-medium' onClick={() => showModal("", "notEdit")}>
                    <AddIcon />  Extend Days
                </Button>
            </div>
            {caseDocumentData?.length > 0 ? (
                caseDocumentData.map((caseItem: CaseDocument, index: number) => (
                    <div key={index + 'caseDocument'} className='flex gap-5 items-center'>
                        <div className='border-b border-border-gray w-full'>
                            <div className="flex items-center justify-between py-4 px-2">
                                <div className="flex items-center gap-4 w-[20%]">
                                    <Avatar size={40} src={caseItem?.user?.profilePicture} />
                                    <div className="flex flex-col text-sm">
                                        <span className="font-medium text-black">{caseItem?.user?.name}</span>
                                        <span className="text-light-gray text-xs">{moment(caseItem?.createdAt).format('MM/DD/YYYY')}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <DatePickerIcon className="w-6 h-6 text-2xl text-gray-500" />
                                    <p className='mt-1'>{caseItem?.numberOfDays}</p>
                                </div>


                                {caseItem?.description && <div className="flex items-center gap-2 w-[45%]">
                                    <span> <RiErrorWarningLine className="text-2xl text-gray-500" /></span>                                    <p className={`text-sm text-black ${showMoreDescription.showMoreDesId === index && showMoreDescription.show ? "max-w-[90%] whitespace-pre-line" : "truncate max-w-[80%]"}`}>
                                        {showMoreDescription.showMoreDesId === index && showMoreDescription.show
                                            ? caseItem?.description : caseItem?.description.length > 80 ? `${caseItem?.description.slice(0, 80)}...` : caseItem?.description}
                                    </p>
                                    {caseItem?.description.length > 65 && (
                                        <>
                                            {showMoreDescription.showMoreDesId === index && showMoreDescription.show ? (
                                                <span className="text-primary text-xs cursor-pointer ml-1"
                                                    onClick={() => handleViewLess(index)}> Show less </span>
                                            ) : (
                                                <span
                                                    className="text-primary text-xs cursor-pointer ml-1"
                                                    onClick={() => handleViewMore(index)} > View more </span>
                                            )}
                                        </>
                                    )}
                                </div>}

                                <div className="flex gap-2 justify-end items-center">
                                    <Button variant='text' className='border-0 shadow-none px-0 w-6 justify-center' onClick={() => showModal(caseItem, "edit")}>
                                        <EditIcon />
                                    </Button>
                                    <div className='flex gap-2'>
                                        <Popconfirm
                                            title='Are you sure to delete?'
                                            placement='topRight'
                                            onConfirm={() => handleRemoveEntry(caseItem?._id)}
                                            okText='Yes'
                                            cancelText='No'
                                            disabled={isDeletingCase}
                                        >
                                            <Button variant='text' className='border-0 shadow-none px-0 w-6 justify-center'>
                                                <DeleteIcon />
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className='text-center text-light-gray font-medium py-5'>{description}</p>
            )}


            <AddExtendDaysModal
                onCancel={handleCancel}
                open={isModalOpen}
                onAddExtendDays={handleAddExtensions}
                editedModalData={editedModalData}
                handleUpdateExtendDays={handleUpdateExtendDays}
                isEdit={isEditModal}
            />

        </section >
    );
}

export default Extensions;
