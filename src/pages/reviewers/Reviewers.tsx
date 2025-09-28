import React, { useEffect, useState, Suspense } from "react";
import { Checkbox, Button, Spin, Empty, Tooltip, Pagination } from "antd";
import FallbackLoader from "components/core-ui/fallback-loader/FallbackLoader";
//utils
import { useHeaderProps } from "components/core/use-header-props";
import { IUserModel } from "auth";
//icons
// import { SearchOutlined } from "@ant-design/icons";
import ArrowIcon from "assets/icons/arrow-icon.svg?react";
// import { debounce } from "helpers/CustomHelpers";
import ReviewerDetailModal from "components/modals/ReviewerDetailModal";
import useGetAllReviewers from "./core/hooks/useGetAllReviewers";

const Table_Header = [
    "User ID",
    "Full Name",
    "Email Address",
    "Total Reviews",
    "Status",
    "",
];

const statusColors: Record<IUserModel["status"], string> = {
    Active: "text-secondary",
    Suspended: "text-dark-gray",
    Archived: "text-dark-gray",
};

const Reviewers: React.FC = () => {
    const { setTitle } = useHeaderProps();
    // const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [modalData, setModalData] = useState<IUserModel>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [params, setParams] = useState({
        limit: 10,
        page: 1,
    });

    // const { userData, isLoading, pagination, refetch } = useUserData(params);
    const { reviewersData, isLoading, pagination, refetch } = useGetAllReviewers(params);

    useEffect(() => setTitle('Reviewers'), [setTitle]);

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setParams(prev => ({ ...prev, status: status }))
    };

    // const debouncedOnChange = useCallback(
    //     debounce((name: string) => {
    //         setParams((prev) => ({ ...prev, name }));
    //     }, 800),
    //     []
    // );

    const handleModalToggle = (data: IUserModel) => {
        setIsModalOpen(true);
        setModalData(data)
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };

    return (
        <section className="overflow-hidden my-10">
            {/* Search and Filters */}
            <div className="flex flex-col gap-y-5">
                {/* <Input
                    placeholder="Search by name"
                    prefix={<SearchOutlined className="mr-5" />}
                    variant="underlined"
                    className="w-full"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); debouncedOnChange(e.target.value) }}
                /> */}

                <div className="border border-border-gray p-5 rounded flex items-center gap-4 flex-wrap">
                    <Checkbox
                        checked={selectedStatus === "all"}
                        onChange={() => handleStatusChange("all")}
                    >
                        All Accounts
                    </Checkbox>
                    <Checkbox
                        checked={selectedStatus === "Active"}
                        onChange={() => handleStatusChange("Active")}
                    >
                        Active
                    </Checkbox>
                    <Checkbox
                        checked={selectedStatus === "Suspended"}
                        onChange={() => handleStatusChange("Suspended")}
                    >
                        Suspended
                    </Checkbox>
                </div>
            </div>

            {/* Heading */}

            {/* Custom Table */}
            <div className="border border-gray-200  rounded-lg mt-5">
                <div className="text-xl bg-black text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
                    Showing all Reviewers {pagination?.total && <span className="text-border-gray text-sm ml-2">{pagination?.total} Results</span>}
                </div>

                {/* Scroll Wrapper */}
                <div className="w-full overflow-x-auto overflow-hiddenh-[800px] lg:max-h-[800px]">
                    {isLoading ?
                        <div className='flex justify-center items-center h-32'>
                            <Spin size="large" />
                        </div>
                        :
                        <>
                            {reviewersData?.length === 0 ?
                                <Empty className="my-12" description="No Users Found" />
                                :
                                <table className="min-w-[1092px] w-full">
                                    <thead className="bg-light-gray text-white">
                                        <tr>
                                            {Table_Header.map((header, index) => (
                                                <th
                                                    key={index}
                                                    className={`${header === "Total Reviews" ? "text-center" : "text-start"} p-5 font-normal text-left text-medium-gray whitespace-nowrap`}
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviewersData?.map((user: any, index: number) => (
                                            <tr key={index} className="border-t hover:bg-gray-50">
                                                <td className="p-5  truncate max-w-[160px]">
                                                    <Tooltip title={user?._id}>
                                                        {user?._id}
                                                    </Tooltip>
                                                </td>
                                                <td className="p-5">{user?.firstName} {user?.lastName}</td>
                                                <td className="p-5">{user?.email}</td>
                                                <td className="p-5 text-center">{user?.totalReviews || "0"}</td>
                                                <td className={`p-5 ${statusColors[user?.status]}`}>
                                                    {user?.status}
                                                </td>
                                                <td className="p-5 text-xl cursor-pointer">
                                                    <Button onClick={() => handleModalToggle(user)} className="border-none shadow-none">
                                                        <ArrowIcon />
                                                    </Button>
                                                </td>
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

            {reviewersData?.length > 0 && <Pagination
                className="mt-5 justify-center text-white"
                current={params?.page}
                pageSize={pagination?.limit}
                total={pagination?.total}
                onChange={handlePageChange}
            />}



            <Suspense fallback={<FallbackLoader />}>
                {isModalOpen &&
                    <ReviewerDetailModal
                        refetchReviewerData={refetch}
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        userData={modalData}
                    />}
            </Suspense>
        </section>
    );
};

export default Reviewers;
