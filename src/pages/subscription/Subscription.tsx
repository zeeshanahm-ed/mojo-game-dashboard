import React, { useEffect, useState } from "react";
import { Spin, Empty, Pagination, Select, Tooltip } from "antd";
import dayjs from "dayjs"
//utils
import { useHeaderProps } from "components/core/use-header-props";
import useGetAllSubscriptionHistory from "./core/hooks/useGetAllSubscriptionHistory";
import { useTranslation } from "react-i18next";
import { useDirection } from "hooks/useGetDirection";

const Table_Header = [
    "User ID",
    "Full Name",
    "Status",
    "Email Address",
    "Amount",
    "Initial Order",
    "Renewal Date",
];

const StatusColorClass: Record<StatusType, string> = {
    active: "bg-[#CCFFD6] text-[#1C8432]",
    pending: "bg-[#FFF1CC] text-[#75841C]",
    completed: "bg-[#CCFFD6] text-[#1C8432]",
    canceled: "bg-[#DADADA] text-[#636363]",
};

type StatusType = "active" | "pending" | "completed" | "canceled";


export const Subscription: React.FC = () => {
    const { t } = useTranslation();
    const { setTitle } = useHeaderProps();
    const direction = useDirection();
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
    const [params, setParams] = useState({
        page: 1,
        limit: 15,
        sortBy: "updatedAt",
        sortOrder: "desc",
    })
    const { subscriptionData, pagination, isLoading } = useGetAllSubscriptionHistory(params)

    const statusOptions = [
        { value: 'active', label: t('active') },
        { value: 'pending', label: t('pending') },
        { value: 'canceled', label: t('canceled') },
        { value: 'completed', label: t('completed') },
    ];

    useEffect(() => setTitle(t('Subscriptions')), [setTitle, t]);

    const handleSelectChange = (value: string | undefined) => {
        setSelectedStatus(value);
        setParams(prev => ({ ...prev, page: 1, status: value }))
    };

    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };

    const getOptions = () => {
        return statusOptions.map((option: any) => ({
            value: option.value,
            label: (
                <div className="flex items-center gap-2">
                    <span className={`${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{t(option.label)}</span>
                </div>
            ),
        }));
    };

    return (
        <section className="overflow-hidden my-10">
            {/* Filters */}
            <div className="flex items-center gap-5 flex-wrap">
                <Select
                    allowClear
                    options={getOptions()}
                    placeholder={t('Choose Status')}
                    className={`h-12 w-48`}
                    direction={direction}
                    onChange={(value) => handleSelectChange(value)}
                    value={selectedStatus || undefined}
                />
            </div>

            {/* Heading */}

            {/* Custom Table */}
            <div className="border border-gray-200  rounded-lg mt-5">
                <div className="text-xl bg-black text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
                    {t('Subscriptions records')} <span className="text-border-gray text-sm me-2">{pagination?.total} {t('Results')}</span>
                </div>

                {/* Scroll Wrapper */}
                <div className="w-full overflow-x-auto h-[800px] lg:max-h-[800px]">
                    {isLoading ?
                        <div className='flex justify-center items-center h-32'>
                            <Spin size="large" />
                        </div>
                        :
                        <>
                            {subscriptionData?.length === 0 ?
                                <Empty className={`my-12 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`} description={t('No Users Found')} />
                                :
                                <table className="min-w-[1092px] w-full">
                                    <thead className="bg-light-gray text-white">
                                        <tr>
                                            {Table_Header.map((header, index) => (
                                                <th
                                                    key={index}
                                                    className="p-5 font-normal text-left text-medium-gray whitespace-nowrap"
                                                >
                                                    {t(header)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscriptionData?.map((subscription: any, index: number) => (
                                            <tr key={index} className="border-t hover:bg-gray-50">
                                                <Tooltip title={subscription?.user?._id || "-"}>
                                                    <td className="p-5  truncate max-w-[160px]">{subscription?.user?._id || "-"}</td>
                                                </Tooltip>
                                                <td className="p-5"> {subscription?.user?.name || "-"}</td>
                                                <td className="">
                                                    <div className={`flex-centered rounded-lg w-30 h-10 capitalize ${StatusColorClass[subscription?.status as StatusType]}`}>{t(subscription?.status as string)}</div>
                                                </td>
                                                <td className="p-5">{subscription?.user?.email || "-"}</td>
                                                <td className="p-5 capitalize">{`${subscription?.amount} ${subscription?.currency || "SAR"}` || "-"}</td>
                                                <td className={`p-5`}>{dayjs(subscription?.startDate).format("MM/DD/YYYY")}</td>
                                                <td className={`p-5`}>{dayjs(subscription?.nextBillingDate).format("MM/DD/YYYY")}</td>
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
