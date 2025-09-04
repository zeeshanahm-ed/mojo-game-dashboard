import React, { useEffect, useState } from "react";
import { Spin, Empty, Pagination, Select } from "antd";
//utils
import { useHeaderProps } from "components/core/use-header-props";

const Table_Header = [
    "User ID",
    "Full Name",
    "Status",
    "Email",
    "Initial Order",
    "Renewal Date",
];

const StatusColorClass: Record<StatusType, string> = {
    Active: "bg-[#CCFFD6] text-[#1C8432]",
    Pending: "bg-[#FFF1CC] text-[#75841C]",
    Completed: "bg-[#CCFFD6] text-[#1C8432]",
    Cancelled: "bg-[#DADADA] text-[#636363]",
};

type StatusType = "Active" | "Pending" | "Completed" | "Cancelled";

// Transaction interface definition with strict typing
interface Transaction {
    userId: string;
    fullName: string;
    email: string;
    status: StatusType;
    initialOrder: string;
    renewalDate: string;
}

// Static data array
const SubscriptionData: Transaction[] = [
    {
        userId: "123456789",
        fullName: "Muhammad Huzaifa",
        status: "Active",
        email: "muhammad.huzaifa@example.com",
        initialOrder: "10/12/2025",
        renewalDate: "10/12/2026"
    },
    {
        userId: "987654321",
        fullName: "Bilal Muhammad",
        email: "bilal.muhammad@example.com",
        status: "Active",
        initialOrder: "10/12/2025",
        renewalDate: "10/12/2026"
    },
    {
        userId: "456789123",
        fullName: "Tayyab Karim",
        email: "tayyab.karim@example.com",
        initialOrder: "10/12/2025",
        renewalDate: "10/12/2026",
        status: "Pending"
    },
    {
        userId: "321654987",
        fullName: "John Anderson",
        email: "john.anderson@example.com",
        initialOrder: "10/12/2025",
        status: "Pending",
        renewalDate: "10/12/2026"
    },
    {
        userId: "654321789",
        fullName: "Brad Johnson",
        email: "brad.johnson@example.com",
        initialOrder: "10/12/2025",
        status: "Cancelled",
        renewalDate: "10/12/2026"
    },
    {
        userId: "654321789",
        fullName: "Brad Johnson",
        email: "brad.johnson@example.com",
        initialOrder: "10/12/2025",
        status: "Completed",
        renewalDate: "10/12/2026"
    },
]
const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Completed', label: 'Completed' },
];


export const Subscription: React.FC = () => {
    const { setTitle } = useHeaderProps();
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);


    useEffect(() => setTitle('Payments & Transactions'), [setTitle]);

    const handleSelectChange = (value: string | undefined) => {
        setSelectedStatus(value);
    };

    const handlePageChange = (page: number) => {
        console.log(page);
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
                    Showing user’s Transactions <span className="text-border-gray text-sm ml-2">{SubscriptionData.length} Results</span>
                </div>

                {/* Scroll Wrapper */}
                <div className="w-full overflow-x-auto overflow-y-auto h-[800px] lg:max-h-[800px]">
                    {false ?
                        <div className='flex justify-center items-center h-32'>
                            <Spin size="large" />
                        </div>
                        :
                        <>
                            {SubscriptionData?.length === 0 ?
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
                                        {SubscriptionData?.map((subscription: Transaction, index: number) => (
                                            <tr key={index} className="border-t hover:bg-gray-50">
                                                <td className="p-5  truncate max-w-[160px]">{subscription.userId}</td>
                                                <td className="p-5"> {subscription.fullName}</td>
                                                <td className="">
                                                    <div className={`flex-centered rounded-lg w-30 h-10 ${StatusColorClass[subscription.status]}`}>{subscription.status}</div>
                                                </td>
                                                <td className="p-5">{subscription.email}</td>
                                                <td className={`p-5`}>{subscription.initialOrder}</td>
                                                <td className={`p-5`}>{subscription.renewalDate}</td>
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
                current={1}
                pageSize={10}
                total={SubscriptionData?.length}
                onChange={handlePageChange}
                itemRender={(page, type, originalElement) => {
                    if (type === "page") {
                        return (
                            <button
                                disabled={page === 1} // disable current page
                                className={`px-3 ${page === 1 ? "cursor-not-allowed"
                                    : ""
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    }
                    return originalElement;
                }}
            />
        </section>
    );
};

export default Subscription;
