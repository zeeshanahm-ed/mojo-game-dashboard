import { useEffect, useState } from "react";
import { Button, DatePicker, Pagination, Popconfirm } from "antd";
//Hooks & Utilities
import { useHeaderProps } from "components/core/use-header-props";
import dayjs from 'dayjs';
//icons
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
//componets
import CustomAlertTable from "../components/CustomTable";
import CustomSearchSelect from "../components/CustomSearchSelect";
//Hooks and Helpers
import { showErrorMessage, showSuccessMessage } from "utils/messageUtils";
import useDeleteAlerts from "./hooks/useDeleteAlert";
import { useNavigate } from "react-router-dom";
import useClientData from "pages/clients/core/hooks/clients";
import { ClientInfo, FormattedClient, serviceDataParams } from "pages/services/core/_modals";
import useUpdateAlert from "./hooks/useUpdateAlert";

interface stateInter {
    modifyAlertData: any,
}


const tableHeaders = [
    { title: 'Service ID', key: 'servceId', className: 'w-[15%]' },
    { title: 'Client Name', key: 'clientName', className: 'w-[15%]' },
    { title: 'Assigned to', key: 'assignedTo', className: 'w-[15%]' },
    { title: 'Alert Date', key: 'alertDate', className: 'w-[15%]' },
    { title: 'Alert Message', key: 'alertMessage', className: 'w-[40%] border-r-0' },
    { title: '', key: 'action', className: 'flex-1 border-r-0' },
];

const intitialParams: serviceDataParams = {
    limit: 10,
    page: 1,
    search: '',
    sort: 'createdAt',
    status: null,
    clientId: '',
};

function Alerts({ isLoading, alertData, refetch, setListing, listing }: any) {
    const navigate = useNavigate();
    const [filterListing] = useState<any>({ ...intitialParams });

    const { clientData } = useClientData(filterListing);
    const { setTitle } = useHeaderProps();
    const { deleteAlertMutate } = useDeleteAlerts();
    const { updateAlert } = useUpdateAlert();

    const [timer, setTimer] = useState<number | null>(null);

    const [state, setState] = useState<stateInter>({
        modifyAlertData: [],
    });


    useEffect(() => {
        setTitle('Alerts');
    }, []);

    useEffect(() => {
        handleUpdateAlert();
        const modifyData = alertData?.data?.map((data: any) => {
            return {
                ...data,
                checked: false,
            }
        });
        setState(prev => ({ ...prev, modifyAlertData: modifyData }))
    }, [alertData]);

    const handleUpdateAlert = () => {
        const unreadAlerts = alertData?.data?.filter((item: any) => !item?.isRead);
        if (unreadAlerts?.length > 0) {
            const payload = {
                isRead: true,
            };
            updateAlert(payload, {
                onSuccess: () => {
                    refetch();
                },
                onError: (error) => {
                    console.error('Update error:', error);
                },
            });
        };
    };

    const handleDeleteAlerts = () => {
        const checkedIdsPayload = {
            ids: state.modifyAlertData
                ?.filter((v: any) => v.checked)
                .map((v: any) => v._id),
        };

        deleteAlertMutate(checkedIdsPayload, {
            onSuccess: () => {
                showSuccessMessage('Alert deleted successfully');
                refetch();
            },
            onError: (error) => {
                console.error(error);
                showErrorMessage('Alert failed to delete.');
            },
        });
    };

    const handleDateChange = (date: any) => {
        if (date) {
            setListing((prev: any) => ({ ...prev, alertDate: date?.toISOString() }));
        } else {
            setListing((prev: any) => ({ ...prev, alertDate: null }));
        }
    }


    const handleAssignedToFilter = (value: any) => {
        const stringValue = value as string;
        setListing((prev: any) => ({ ...prev, assignedTo: stringValue }));
    };

    const handleAssignedToFilterSearch = () => {
        clearTimeout(timer as number);
        // const query = value;
        const newTimer = setTimeout(() => {
            //Make Api call
        }, 1000);
        setTimer(newTimer);
    };

    const handlePageChange = (page: number) => {
        setListing((prev: any) => ({ ...prev, page: page }));
    };

    const handleAlertClick = (alert: any) => {
        let clientId = alert?.client?._id;
        navigate(clientId ? `/services/service-detail/${alert?.caseId}` : `service-detail/${alert?.caseId}`)
    };

    const handleCheckbox = (value: any) => {
        const modifyData = state.modifyAlertData.map((alert: any) => {
            if (value?._id === alert?._id) {
                return {
                    ...alert,
                    checked: !alert.checked
                }
            } else {
                return alert;
            };
        });

        setState(prev => ({ ...prev, modifyAlertData: modifyData }))
    };

    const handleDisabled = () => {
        return !state?.modifyAlertData?.some((v: any) => v.checked === true);
    };

    const formatClientData = (data: ClientInfo[] | undefined): FormattedClient[] => {
        if (!data) return [];
        return data.map((d) => ({
            id: d?._id || '',
            clientName: d?.basicInformation?.clientName || '',
            clientId: d?.basicInformation?.clientId || '',
            _id: d?._id,
            selectedClient: false,
            basicInformation: d?.basicInformation,
            text: d?.basicInformation?.clientName || '',
            value: d?._id || '',
        }));
    };

    return (
        <section className="overflow-hidden mb-10">
            <div className="flex justify-between items-center mt-10 flex-wrap gap-6">
                <div className="flex justify-between items-center gap-x-6 gap-y-2" >
                    <div className="flex items-center border border-border-gray px-3 h-11 custom-radius min-w-60">
                        <DatePickerIcon className="w-6 h-6 mr-2" />
                        <DatePicker
                            suffixIcon={false}
                            format="MM/DD/YYYY"
                            placeholder="Select date"
                            className="w-full h-11 custom-radius"
                            showTime={false}
                            value={listing?.alertDate ? dayjs(listing?.alertDate) : null} // ✅ ensure it's dayjs
                            onChange={handleDateChange}
                            variant="borderless"
                        />
                    </div>
                    <CustomSearchSelect
                        value={listing?.assignedTo}
                        data={formatClientData(clientData?.data)}
                        handleOnSearch={handleAssignedToFilterSearch}
                        handleOnChange={handleAssignedToFilter}

                    />
                </div>
                <div>
                    <Popconfirm
                        title='Are you sure you want to delete the selected alerts?'
                        onConfirm={handleDeleteAlerts}
                        okText='Yes'
                        cancelText='No'
                    >
                        <Button
                            variant='text'
                            disabled={handleDisabled()}
                            className='border border-danger text-danger font-normal shadow-none h-11 px-2 gap-6 text-sm w-50 custom-radius'>
                            <DeleteIcon />  Delete Alerts
                        </Button>
                    </Popconfirm>
                </div>
            </div>
            <CustomAlertTable
                tableHeaders={tableHeaders}
                data={state?.modifyAlertData}
                handleAlertClick={(data) => handleAlertClick(data)}
                handleCheckbox={(data) => handleCheckbox(data)}
                isLoading={isLoading}
                message={"No Alerts Found"}
            />

            {/* Pagination */}
            {!isLoading && <div className="flex justify-center mt-6">
                <Pagination
                    current={alertData?.currentPage}
                    pageSize={alertData?.pageSize}
                    total={alertData?.totalItems}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>}
        </section>
    )
}

export default Alerts;