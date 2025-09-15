import React, { useEffect, useState } from "react";
import { Spin, Empty, Pagination, Select, Tooltip } from "antd";
import dayjs from "dayjs"
//utils
import { useHeaderProps } from "components/core/use-header-props";
import useGetAllSubscriptionHistory from "./core/hooks/useGetAllSubscriptionHistory";

const Table_Header = [
    "User ID",
    "Full Name",
    "Status",
    "Email",
    "Initial Order",
    "Renewal Date",
];

const StatusColorClass: Record<StatusType, string> = {
    active: "bg-[#CCFFD6] text-[#1C8432]",
    pending: "bg-[#FFF1CC] text-[#75841C]",
    completed: "bg-[#CCFFD6] text-[#1C8432]",
    cancelled: "bg-[#DADADA] text-[#636363]",
};

type StatusType = "active" | "pending" | "completed" | "cancelled";

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'canceled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' },
];

export const Subscription: React.FC = () => {
    const { setTitle } = useHeaderProps();
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
    const [params, setParams] = useState({
        page: 1,
        limit: 10,
    })
    const { subscriptionData, pagination, isLoading } = useGetAllSubscriptionHistory(params)


    useEffect(() => setTitle('Payments & Transactions'), [setTitle]);

    const handleSelectChange = (value: string | undefined) => {
        setSelectedStatus(value);
        setParams(prev => ({ ...prev, page: 1, status: value }))
    };

    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };


    return (
        <section className="overflow-hidden my-10">
            {/* Filters */}
            <div className="flex items-center gap-5 flex-wrap">
                <Select
                    allowClear
                    options={statusOptions}
                    placeholder="Choose Status"
                    className='h-12 w-48'
                    onChange={(value) => handleSelectChange(value)}
                    value={selectedStatus || undefined}
                />
            </div>

            {/* Heading */}

            {/* Custom Table */}
            <div className="border border-gray-200  rounded-lg mt-5">
                <div className="text-xl bg-black text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
                    Showing user’s Transactions <span className="text-border-gray text-sm ml-2">{pagination?.total} Results</span>
                </div>

                {/* Scroll Wrapper */}
                <div className="w-full overflow-x-auto overflow-y-auto h-[800px] lg:max-h-[800px]">
                    {isLoading ?
                        <div className='flex justify-center items-center h-32'>
                            <Spin size="large" />
                        </div>
                        :
                        <>
                            {subscriptionData?.length === 0 ?
                                <Empty className="my-12" description="No Users Found" />
                                :
                                <table className="min-w-[1092px] w-full">
                                    <thead className="bg-light-gray text-white">
                                        <tr>
                                            {Table_Header.map((header, index) => (
                                                <th
                                                    key={index}
                                                    className="p-5 font-normal text-left text-medium-gray whitespace-nowrap"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscriptionData?.map((subscription: any, index: number) => (
                                            <tr key={index} className="border-t hover:bg-gray-50">
                                                <Tooltip title={subscription.userId || "-"}>
                                                    <td className="p-5  truncate max-w-[160px]">{subscription.userId || "-"}</td>
                                                </Tooltip>
                                                <td className="p-5"> {subscription.fullName || "-"}</td>
                                                <td className="">
                                                    <div className={`flex-centered rounded-lg w-30 h-10 capitalize ${StatusColorClass[subscription?.status as StatusType]}`}>{subscription?.status}</div>
                                                </td>
                                                <td className="p-5">{subscription.email || "-"}</td>
                                                <td className={`p-5`}>{dayjs(subscription.startDate).format("MM/DD/YYYY")}</td>
                                                <td className={`p-5`}>{dayjs(subscription.nextBillingDate).format("MM/DD/YYYY")}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }
                        </>
                    }
                </div>
            </div>
            {/* Pagination */}

            <Pagination
                className="mt-5 justify-center text-white"
                current={params.page}
                pageSize={params.limit}
                total={pagination?.total}
                onChange={handlePageChange}
            />
        </section>
    );
};

export default Subscription;
