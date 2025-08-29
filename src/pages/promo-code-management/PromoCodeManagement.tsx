import React, { useEffect, useState } from "react";
import { useHeaderProps } from "components/core/use-header-props";
import { Button, message, Popconfirm } from "antd";
import { promoCodesData } from "constants/global";
//icons
import EditIcon from 'assets/icons/edit-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import AddRoundedIcon from 'assets/icons/add-rounded-icon.svg?react';
import PromoModal from "components/modals/PromoModal";
import { PromoCodeRecord } from "utils/Interfaces";

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

export const PromoCodeManagement: React.FC = () => {
    const { setTitle } = useHeaderProps();
    const [modalVisible, setModalVisible] = useState(false);
    const [editData, setEditData] = useState<PromoCodeRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [promoList, setPromoList] = useState<PromoCodeRecord[]>(promoCodesData)

    useEffect(() => setTitle('Promo Code Managment'), []);

    const handleAddNewPromoCode = () => {
        setEditData(null);
        setModalVisible(true);
    };

    const handleEditClick = (promo: PromoCodeRecord) => {
        setEditData(promo);
        setModalVisible(true);
    };

    const handleDeleteClick = (id: string) => {
        setPromoList(prev => prev.filter(promo => promo.id !== id));
        message.success('Promo code deleted successfully');
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditData(null);
    };

    const handleModalSubmit = async (data: PromoCodeRecord) => {
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (editData) {
                // Update existing promo
                setPromoList(prev =>
                    prev.map(promo =>
                        promo.id === editData.id ? { ...data, id: editData.id } : promo
                    )
                );
                message.success('Promo code updated successfully');
            } else {
                // Add new promo
                const newPromo = {
                    ...data,
                    id: Date.now().toString()
                };
                setPromoList(prev => [...prev, newPromo]);
                message.success('Promo code added successfully');
            }

            setModalVisible(false);
            setEditData(null);
        } catch (error) {
            message.error('Failed to save promo code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="overflow-hidden my-10">
            <div className="flex justify-between items-center flex-wrap gap-6">
                <div>
                    <Button
                        variant='text'
                        onClick={handleAddNewPromoCode}
                        className='border border-primary bg-primary text-white font-normal shadow-none h-11 px-5 gap-6 text-sm w-fit'>
                        <AddRoundedIcon className="fill-white text-white" />  Add New Promo
                    </Button>
                </div>
            </div>
            {/* Custom Table */}
            <div className="border border-gray-200  rounded-lg mt-5">
                <div className="text-xl bg-medium-gray text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
                    Promo Codes <span className="text-border-gray text-sm ml-2">{promoList.length} Results</span>
                </div>
                {/* Scroll Wrapper */}
                <div className="w-full overflow-x-auto overflow-y-auto h-[800px] lg:max-h-[800px]">
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
                            {promoList.map((promo) => (
                                <tr key={promo.id} className="border-b hover:bg-gray-50">
                                    <td className="p-5">{promo.createdDate}</td>
                                    <td className="p-5">{promo.promoCode}</td>
                                    <td className="p-5">{promo.percentage}</td>
                                    <td className="p-5">{promo.usageLimit}</td>
                                    <td className="p-5">{promo.assigned}</td>
                                    <td className="p-5 text-blue-600 underline cursor-pointer">
                                        <a href={promo.promoAnalyticsLink}>Track usage</a>
                                    </td>
                                    <td className="p-5">{promo.expiryDate}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <Button variant="text" onClick={() => handleEditClick(promo)} className="border-none shadow-none px-2">
                                                <EditIcon className="text-black" />
                                            </Button>
                                            <Popconfirm
                                                title="Are you sure to delete this promo code?"
                                                onConfirm={() => handleDeleteClick(promo.id)}
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
                    {promoList.length === 0 && (
                        <div className="p-4 text-gray-500">No users found.</div>
                    )}
                </div>
            </div>
            <PromoModal
                visible={modalVisible}
                onCancel={handleModalCancel}
                onSubmit={handleModalSubmit}
                editData={editData}
                loading={loading}
            />
        </section>
    );
};

export default PromoCodeManagement;