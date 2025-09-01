import React, { useEffect, useState } from "react";
import { useHeaderProps } from "components/core/use-header-props";
import { Button, Empty, Pagination, Popconfirm, Spin } from "antd";
import dayjs from "dayjs";
import useGetPromoData from "./core/hooks/useGetPromoData";
import useDeletePromoCode from "./core/hooks/useDeletePromoCode";
import { showErrorMessage, showSuccessMessage } from "utils/messageUtils";
import AddNEditPromoModal from "components/modals/AddNEditPromoModal";
//icons
import EditIcon from 'assets/icons/edit-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import AddRoundedIcon from 'assets/icons/add-rounded-icon.svg?react';

export const Table_Header = [
    { label: "Created", key: "createdDate" },
    { label: "Promo Code", key: "promoCode" },
    { label: "Percentage", key: "percentage" },
    { label: "Usage limit", key: "usageLimit" },
    { label: "Assigned", key: "assigned" },
    { label: "Promo Analytics", key: "promoAnalyticsLink" },
    { label: "Expiry Date", key: "expiryDate" },
    { label: 'Action', key: 'action', },
];

interface GetPromoCodesParams {
    page: number;
    limit: number;
}

export const PromoCodeManagement: React.FC = () => {
    const { setTitle } = useHeaderProps();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [params, setParams] = useState<GetPromoCodesParams>({
        page: 1,
        limit: 10,
    });
    const { promoData, isLoading, pagination, refetch } = useGetPromoData(params);
    const { deletePromoCodeMutate } = useDeletePromoCode();

    useEffect(() => setTitle('Promo Code Managment'), []);

    const handleEditClick = (promo: any) => {
        setEditData(promo);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        deletePromoCodeMutate(id, {
            onSuccess: () => {
                showSuccessMessage('Promo code deleted successfully.');
                refetch();
            },
            onError: () => {
                showErrorMessage('Failed to delete promo code.');
            },
        });
    };

    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };

    return (
        <section className="overflow-hidden my-10">
            <div className="flex justify-between items-center flex-wrap gap-6">
                <div>
                    <Button
                        variant='text'
                        onClick={() => setIsModalOpen(true)}
                        className='border border-primary bg-primary text-white font-normal shadow-none h-11 px-5 gap-6 text-sm w-fit'>
                        <AddRoundedIcon className="fill-white text-white" />  Add New Promo
                    </Button>
                </div>
            </div>
            {/* Custom Table */}
            <div className="border border-gray-200  rounded-lg mt-5">
                <div className="text-xl bg-medium-gray text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
                    Promo Codes <span className="text-border-gray text-sm ml-2">{pagination?.total} Results</span>
                </div>
                {/* Scroll Wrapper */}
                <div className="w-full overflow-x-auto overflow-y-auto h-[800px] lg:max-h-[800px]">
                    {isLoading ?
                        <div className='flex justify-center items-center h-32'>
                            <Spin size="large" />
                        </div>
                        :
                        <>
                            {promoData?.length === 0 ?
                                <Empty className="my-12" description="No Promo Codes is available" />
                                :
                                <table className="min-w-[1092px] w-full">
                                    <thead className="bg-light-gray text-white">
                                        <tr className="border-b">
                                            {Table_Header.map((header, index) => (
                                                <th
                                                    key={index}
                                                    className="p-5 font-normal text-left text-medium-gray whitespace-nowrap"
                                                >
                                                    {header.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {promoData.map((promo: any) => (
                                            <tr key={promo._id} className="border-b hover:bg-gray-50">
                                                <td className="p-5">{dayjs(promo?.createdAt).format("DD/MM/YYYY")}</td>
                                                <td className="p-5">{promo?.code || "-"}</td>
                                                <td className="p-5">{`${promo?.percentage}%` || "-"}</td>
                                                <td className="p-5">{promo?.usageLimit || "-"}</td>
                                                <td className="p-5">{promo?.assigned || "-"}</td>
                                                <td className="p-5 text-blue-600 underline cursor-pointer">
                                                    <a href={promo?.promoAnalyticsLink || "-"}>Track usage</a>
                                                </td>
                                                <td className="p-5">{dayjs(promo?.validUntil).format("DD/MM/YYYY") || "-"}</td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="text" onClick={() => handleEditClick(promo)} className="border-none shadow-none px-2">
                                                            <EditIcon className="text-black" />
                                                        </Button>
                                                        <Popconfirm
                                                            title="Are you sure to delete this promo code?"
                                                            onConfirm={() => handleDeleteClick(promo?._id)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <Button className="border-none shadow-none px-2"><DeleteIcon /></Button>
                                                        </Popconfirm>
                                                    </div>
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
            <Pagination
                className="mt-5 justify-center text-white"
                current={params?.page}
                pageSize={pagination?.limit}
                total={pagination?.total}
                onChange={handlePageChange}
            />
            <AddNEditPromoModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                refetchPromoData={refetch}
            />
        </section>
    );
};

export default PromoCodeManagement;