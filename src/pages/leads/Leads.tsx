

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

//componets
import { Button, Select, Pagination, Empty, Spin, Popconfirm } from 'antd';
//icons
import AddIcon from 'assets/icons/rounded-add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import ArrowIcon from "assets/icons/arrow-icon.svg?react"
import FilterIcon from 'assets/icons/filter-icon.svg?react';

//hooks
import { useHeaderProps } from 'components/core/use-header-props';
//interfaces
import { LeadsData, LeadsDataParams } from './core/_modals';
import AddLeadmodal from 'components/modals/Add-lead-modal';
import useLeadsData from './core/hooks/useLeadsData';
import useDeleteLead from './core/hooks/useDeleteLead';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useServiceType from 'pages/services/core/hooks/serviceType';
import { formatServiceType } from 'helpers/CustomHelpers';

const statusOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'CONTECTED', label: 'Contacted' },
    { value: 'NOT_INTERESTED', label: 'Not Interested' },
    { value: 'READY_tO_CONVERT', label: 'Ready to Convert' },
    { value: 'CONVERTED', label: 'Converted' },
    { value: 'LEAD_COMPLETEd', label: 'Lead Completed' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'PANDING', label: 'Pending' },
];

// Define headers for the custom table
const tableHeaders = [
    { title: 'Date', key: 'date', className: 'w-[15%]' },
    { title: 'Name', key: 'name', className: 'w-[20%]' },
    { title: 'Service interest', key: 'serviceInterest', className: 'w-[35%]' },
    { title: 'Lead Status', key: 'leadStatus', className: 'w-[20%] border-r-0' },
    { title: '', key: 'action', className: 'w-[10%] border-r-0' },
];

const Leads: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [filtered, setFilteres] = useState<LeadsDataParams>({
        caseType: undefined,
        leadStatus: undefined,
        page: 1,
        limit: 10,
    });
    //Api hooks
    const { setTitle } = useHeaderProps();
    const { leadData, isLoading, refetch } = useLeadsData(filtered);
    const { deleteLeadMutate } = useDeleteLead();
    const { serviceTypeData } = useServiceType()


    useEffect(() => {
        setTitle('Leads');
    }, []);

    const handlePageChange = (page: number) => {
        setFilteres(prev => ({ ...prev, page }));
    };

    const handleModalCloseNOpen = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleLeadClick = (leadData: LeadsData) => {
        navigate(`/leads/lead-details/${leadData._id}`)
    };

    const handleLeadDelete = (leadData: LeadsData) => {
        deleteLeadMutate(leadData?._id,
            {
                onSuccess: async () => {
                    showSuccessMessage('Lead delete successfully');
                    refetch();
                },
                onError: (error) => {
                    showErrorMessage('Error while deleting Lead!');
                    console.error('Failed to get signed URL', error);
                },
            }
        );
    };

    return (
        <section className='overflow-hidden mb-10'>
            {/* Add Lead Button */}
            <div className="mb-6">
                <Button
                    type="primary"
                    icon={<AddIcon className='flex items-center me-2' />}
                    className="bg-secondary shadow-none font-medium text-white h-11 px-10 custom-radius"
                    size="large"
                    onClick={handleModalCloseNOpen}
                >
                    Add a Lead
                </Button>
                <AddLeadmodal
                    open={isModalOpen}
                    onCancel={handleModalCloseNOpen}
                    refetchLeadData={refetch}
                    serviceTypeData={serviceTypeData}
                />
            </div>

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className={`flex w-full md:w-1/4 items-center h-11 border border-gray-300 custom-radius px-3 bg-white min-w-60`}>
                    <FilterIcon className="text-gray-500 text-base mr-2" />
                    <Select
                        allowClear
                        className="w-full"
                        placeholder="Filter by Service"
                        options={formatServiceType(serviceTypeData?.data)}
                        variant="borderless"
                        onChange={(value: string) => setFilteres(prev => ({ ...prev, caseType: value }))}
                        value={filtered.caseType}
                    />
                </div>
                <Select
                    placeholder="Filter by Status"
                    allowClear
                    onChange={(value: string) => setFilteres(prev => ({ ...prev, leadStatus: value }))}
                    value={filtered.leadStatus}
                    className="w-full md:w-1/4 h-11 custom-radius min-w-60"
                    options={statusOptions}
                />
            </div>

            {isLoading ? (
                <div className='flex justify-center items-center h-32'>
                    <Spin size="large" />
                </div>
            ) : (
                <div className='py-5 w-ful overflow-x-auto'>
                    <div className='min-w-[1100px]'>
                        {/* Table Header */}
                        <div className="flex border border-light-blue rounded py-3">
                            {tableHeaders.map((header) => (
                                <div
                                    key={header.key}
                                    className={`border-r border-light-blue px-6 py-1 text-light-gray text-center font-medium ${header.className}`}
                                >
                                    {header.title}
                                </div>
                            ))}
                        </div>
                        {/* Table Body */}
                        <div>
                            {leadData?.data?.length > 0 ? (
                                leadData?.data?.map((lead: any) => (
                                    <div key={lead._id} className="py-2 flex text-start xl:text-center items-center hover:bg-gray-50 border-b border-border-gray ">
                                        <div className="px-6 py-2 whitespace-nowrap text-sm w-[15%]">{dayjs(lead.createdAt).format("MM/DD/YYYY")}</div>
                                        <div className="px-6 py-2 whitespace-nowrap text-sm w-[20%]">{lead?.clientName}</div>
                                        <div className="px-6 py-2 whitespace-nowrap text-sm w-[35%]">
                                            <div className="flex items-center justify-center px-3 py-1.5">
                                                {lead?.caseType?.name}
                                            </div>
                                        </div>
                                        <div className="px-6 py-2 whitespace-nowrap text-sm w-[20%]">{lead?.leadStatus}</div>
                                        <div className="px-6 py-2 whitespace-nowrap text-sm w-[10%] flex gap-4">
                                            <ArrowIcon className="text-gray-400 hover:text-blue-500 cursor-pointer" onClick={() => handleLeadClick(lead)} />
                                            <Popconfirm
                                                title="Are you sure to delete this Lead?"
                                                onConfirm={() => handleLeadDelete(lead)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <DeleteIcon className="text-gray-400 hover:text-blue-500 cursor-pointer" />
                                            </Popconfirm>

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Empty className="my-12" description="No Leads Found" />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Pagination */}
            {!isLoading && <div className="flex justify-center mt-6">
                <Pagination
                    current={leadData?.currentPage}
                    pageSize={leadData?.pageSize}
                    total={leadData?.totalItems}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>}
        </section>
    );
};

export default Leads
