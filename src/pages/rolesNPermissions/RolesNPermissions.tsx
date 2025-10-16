import React, { useEffect, useState } from "react";
import { Button, Empty, Pagination, Popconfirm, Select, Spin, Tooltip } from "antd";
import MemberAddModal from "./components/MemberAddModal";
//Enums & Interface
import { ROLES } from "utils/Enums";
import { getUser, IUserModel } from "auth";
//Hooks & Utils
import useGetAllUserData from "./core/hooks/useGetAllUserData";
import { useHeaderProps } from "components/core/use-header-props";
import useDeleteSingleUser from "./core/hooks/useDeleteSingleUser";
import { showErrorMessage, showSuccessMessage } from "utils/messageUtils";
import { ROLES_OPTIONS } from "constants/global";
//icons
import { FiChevronDown } from "react-icons/fi";
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import AddRoundedIcon from 'assets/icons/add-rounded-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon.svg?react';
import useHandelChangeRole from "./core/hooks/useChangeRole";
import { ChangeRoleParams } from "./core/_models";
import { hasPermission } from "helpers/CustomHelpers";
import { useTranslation } from "react-i18next";
import { useDirection } from "hooks/useGetDirection";



export interface UserRecord {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    role: ROLES;
}

const Table_Header = [
    { key: 'userId', label: 'User ID' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'role', label: 'Role' },
    { label: 'Action', key: 'action', },
];

export const RolesNPermissions: React.FC = () => {
    const { t } = useTranslation();
    const direction = useDirection();
    const CURRENT_USER = getUser();
    const { setTitle } = useHeaderProps();
    const [memberModal, setMemberModal] = useState(false);
    const [memberModalEditData, setMemberModalEditData] = useState<IUserModel | null>(null);
    const [params, setParams] = useState({
        limit: 10,
        page: 1,
        role: "non_user",
        sortBy: "updatedAt",
        sortOrder: "desc",
    });

    const { userData, pagination, isLoading, refetch } = useGetAllUserData(params);
    const { deleteSingleUser } = useDeleteSingleUser();
    const { changeRoleMutate } = useHandelChangeRole();

    useEffect(() => setTitle(t('Roles & Permissions')), [setTitle, t]);


    const handleDeleteClick = (user: IUserModel) => {
        deleteSingleUser({ userId: user._id }, {
            onSuccess: () => {
                showSuccessMessage(t('User deleted successfully'));
                refetch();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },
        });
    };

    const handleChangeRole = (userId: string, newRole: ChangeRoleParams) => {
        changeRoleMutate({ role: newRole, id: userId }, {
            onSuccess: () => {
                showSuccessMessage(t('User role changed successfully'));
                refetch();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },

        });
    };

    const handleAddMemberModal = (data: IUserModel | null, type: string) => {
        setMemberModal(true);
        setMemberModalEditData(type === 'edit' ? data : null);
    };

    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };

    const disabled = () => {
        return hasPermission(CURRENT_USER?.role, "read_only") || hasPermission(CURRENT_USER?.role, "finance_manager");
    }

    return (
        <section className="overflow-hidden my-10">
            <div className="flex justify-between items-center flex-wrap gap-6">
                <div>
                    <Button
                        disabled={disabled()}
                        variant='text'
                        onClick={() => handleAddMemberModal(null, 'add')}
                        className={` border border-primary bg-primary text-white font-normal shadow-none h-11 px-5 gap-6 text-sm w-fit`}>
                        <AddRoundedIcon className="fill-white text-white" />  {t("Add New Member")}
                    </Button>
                </div>
            </div>
            <div className="border border-gray-200 rounded-xl mt-5">
                {/* Custom Table */}
                <div className="text-xl bg-medium-gray text-white px-4 py-4 rounded-ss-lg rounded-se-lg ">
                    {t("User Accounts")} {pagination?.total > 0 && <span className="text-border-gray text-sm me-2">{pagination?.total} {t("Results")}</span>}
                </div>
                {/* Scroll Wrapper */}
                <div className="w-full overflow-x-auto overflow-hidden h-[800px] lg:max-h-[800px]">
                    {isLoading ?
                        <div className='flex justify-center items-center h-32'>
                            <Spin size="large" />
                        </div>
                        :
                        <>
                            {userData?.length === 0 ?
                                <Empty className={`my-12 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`} description={t("No Users Found")} />
                                :
                                <table className="min-w-[1092px] w-full">
                                    <thead className="bg-light-gray text-white">
                                        <tr>
                                            {Table_Header.map((header, index) => (
                                                <th
                                                    key={index}
                                                    className="p-5 font-normal text-left text-medium-gray whitespace-nowrap"
                                                >
                                                    {t(header.label)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userData?.map((user: IUserModel, index: number) => (
                                            <tr key={index} className="border-t hover:bg-gray-50">
                                                <td className="p-5  truncate max-w-[160px]">
                                                    <Tooltip title={user?._id}>
                                                        {user?._id}
                                                    </Tooltip>
                                                </td>
                                                <td className="p-5">{user?.firstName} {user?.lastName}</td>
                                                <td className="p-5">{user?.email}</td>
                                                <td className="p-5">{user?.phoneNumber}</td>
                                                <RoleCell user={user} onChangeRole={handleChangeRole} disabled={disabled()} />
                                                <td className="p-5 text-xl space-x-2">
                                                    <div className="flex items-center gap-2">
                                                        <Button disabled={disabled()} variant="text" onClick={() => handleAddMemberModal(user, 'edit')} className="border-none shadow-none px-2">
                                                            <EditIcon className="text-black" />
                                                        </Button>
                                                        <Popconfirm
                                                            title={t("Are you sure to delete this user?")}
                                                            onConfirm={() => handleDeleteClick(user)}
                                                            okText={t("Yes")}
                                                            cancelText={t("No")}
                                                            disabled={disabled()}

                                                        >
                                                            <Button disabled={disabled()} className="border-none shadow-none px-2"><DeleteIcon /></Button>
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
            {userData?.length > 0 && <Pagination
                className="mt-5 justify-center text-white"
                current={params?.page}
                pageSize={pagination?.limit}
                total={pagination?.total}
                onChange={handlePageChange}
            />}
            <MemberAddModal
                open={memberModal}
                onCancel={() => setMemberModal(false)}
                EditUserData={memberModalEditData}
                refetchAllUserData={refetch}
            />
        </section>
    );
};

export default RolesNPermissions;

interface Props {
    user: any;
    disabled: boolean;
    onChangeRole: (userId: string, newRole: ChangeRoleParams) => void;
}

export const RoleCell: React.FC<Props> = ({ disabled, user, onChangeRole }) => {
    return (
        <td className="p-5">
            <Select
                disabled={disabled}
                variant="borderless"
                value={user.role}
                className="w-48"
                suffixIcon={<FiChevronDown size={18} color="#000" />}
                options={ROLES_OPTIONS}
                onChange={(value) => onChangeRole(user?._id, { role: value as ROLES })}
            />
        </td>
    );
};
