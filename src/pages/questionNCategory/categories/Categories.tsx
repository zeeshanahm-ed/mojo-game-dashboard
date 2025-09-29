import { useState } from "react";
import { Button, Empty, Pagination, Popconfirm, } from "antd";
import AddNEditCategoryModal from "components/modals/AddNEditCategoryModal";
import useCategoriesData from "./core/hooks/useCategoriesData";
import FallbackLoader from "components/core-ui/fallback-loader/FallbackLoader";
import useDeleteCategory from "./core/hooks/useDeleteCategory";
import { showErrorMessage, showSuccessMessage } from "utils/messageUtils";
import { getUser } from "auth";

//icons
import AddRoundedIcon from 'assets/icons/add-rounded-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon.svg?react';
import GameImage from 'assets/images/game-image.png';
import { hasPermission } from "helpers/CustomHelpers";
import { useTranslation } from "react-i18next";
import { useDirection } from "hooks/useGetDirection";


function Categories() {
    const { t } = useTranslation();
    const direction = useDirection();
    const CURRENT_USER = getUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalEditData, setModalEditData] = useState<any>(null);
    const [params, setParams] = useState({
        limit: 10,
        page: 1,
    });
    const { categoriesData, isLoading, pagination, refetch } = useCategoriesData(params);
    const { deleteCategoryMutate } = useDeleteCategory();

    const handleAddNewCat = () => {
        setIsModalOpen(true);
    };

    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };

    const handleEditClick = (data: any) => {
        setModalEditData(data);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (data: any) => {
        let id = data?._id;
        deleteCategoryMutate(id, {
            onSuccess: () => {
                showSuccessMessage(t('Category deleted successfully'));
                refetch();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },
        });
    };

    return (
        <section className="overflow-hidden mb-10">
            <div className="mt-10">
                <Button
                    disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                    variant='text'
                    onClick={handleAddNewCat}
                    className={`${direction === 'ltr' ? 'font-primary' : 'font-arabic'} border border-primary bg-primary text-white font-normal shadow-none h-11 px-5 gap-6 text-sm w-fit`}>
                    <AddRoundedIcon className="fill-white text-white" />  {t("Add New")}
                </Button>
            </div>

            <div className="border border-gray-200 rounded-xl mt-5">
                {/* Table Title */}
                <div className="flex justify-between text-xl bg-black text-white px-4 py-4 rounded-ss-xl rounded-se-xl">
                    <div>
                        {t("Showing all Categories")}
                        {pagination?.total > 0 && <span className="text-border-gray text-sm me-2">{pagination?.total} {t("Results")}</span>}
                    </div>
                </div>

                <div className="w-full overflow-x-auto overflow-hidden h-[800px] lg:max-h-[800px]">
                    {isLoading ?
                        <FallbackLoader />
                        :
                        <>
                            {categoriesData?.length === 0 ?
                                <Empty className={`my-12 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`} description={t("Categories not Found")} />
                                : <table className="min-w-[1092px] w-full">
                                    {/* Table Header */}
                                    <thead className="bg-light-gray text-white">
                                        <tr className='border-b hover:bg-gray-50'>
                                            <th className={`p-5 font-normal text-start text-medium-gray whitespace-nowrap`}>
                                                {t("Category Picture")}
                                            </th>
                                            <th className={`p-5 font-normal text-center text-medium-gray whitespace-nowrap`}>
                                                {t("Category")}
                                            </th>
                                            <th className={`p-5 font-normal text-end text-medium-gray whitespace-nowrap`}>
                                                {t("Action")}
                                            </th>
                                        </tr>
                                    </thead>

                                    {/* Table Body */}
                                    <tbody>
                                        {categoriesData?.map((row: any, index: number) => (
                                            <tr
                                                key={index}
                                                className="border-b hover:bg-gray-50 text-center"
                                            >
                                                <td className="p-5"><img src={row?.photo || GameImage} alt={row?.name} loading="lazy" className="w-10 h-10 object-contain ml-10" /></td>
                                                <td className="p-5">{row?.name}</td>
                                                <td className="p-5 flex justify-end">
                                                    <div className="flex justify-center items-center gap-4">
                                                        <Button disabled={hasPermission(CURRENT_USER?.role, "read_only")} variant="text" onClick={() => handleEditClick(row)} className="border-none shadow-none">
                                                            <EditIcon className="text-black" />
                                                        </Button>
                                                        <Popconfirm
                                                            title={t("Are you sure to delete this category?")}
                                                            onConfirm={() => handleDeleteClick(row)}
                                                            okText={t("Yes")}
                                                            cancelText={t("No")}
                                                            disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                                                        >
                                                            <Button disabled={hasPermission(CURRENT_USER?.role, "read_only")} variant="text" className="border-none shadow-none">
                                                                <DeleteIcon className="text-error-500" />
                                                            </Button>
                                                        </Popconfirm>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>}
                        </>
                    }
                </div>
            </div>

            {/* Pagination */}

            {categoriesData?.length > 0 && <Pagination
                className="mt-5 justify-center text-white"
                current={params?.page}
                pageSize={pagination?.limit}
                total={pagination?.total}
                onChange={handlePageChange}
                showSizeChanger={false}
            />}

            <AddNEditCategoryModal
                open={isModalOpen}
                onClose={() => { setIsModalOpen(false); setModalEditData(null) }}
                editData={modalEditData}
                refatchCategoriesData={refetch}
            />
        </section>
    )
}

export default Categories;