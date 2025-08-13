import React, { useEffect, useState } from "react";
import { Button, Empty, Popconfirm, Select, Spin, Tooltip } from "antd";
import MemberAddModal from "./components/MemberAddModal";
//Enums & Interface
import { ROLES } from "utils/Enums";
import { IUserModel } from "auth";
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
import EditIcon from 'assets/icons/edit-icon-services.svg?react';
import useHandelChangeRole from "./core/hooks/useChangeRole";
import { ChangeRoleParams } from "./core/_models";



export interface UserRecord {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    role: ROLES;
}

const tableData: UserRecord[] = [
    {
        userId: '031556',
        fullName: 'John Alex',
        email: 'testing123@gmail.com',
        phone: '+96320584138940',
        role: ROLES.SUPER_ADMIN,
    },
    {
        userId: '031557',
        fullName: 'John Alex',
        email: 'testing123@gmail.com',
        phone: '+96320584138940',
        role: ROLES.CONTENT_MANAGER,
    },
    {
        userId: '031558',
        fullName: 'John Alex',
        email: 'testing123@gmail.com',
        phone: '+96320584138940',
        role: ROLES.FINANCE_MANAGER,
    },
    {
        userId: '031559',
        fullName: 'John Alex',
        email: 'testing123@gmail.com',
        phone: '+96320584138940',
        role: ROLES.READ_ONLY,
    },
    {
        userId: '031561',
        fullName: 'John Alex',
        email: 'testing123@gmail.com',
        phone: '+96320584138940',
        role: ROLES.SUPER_ADMIN,
    },
    {
        userId: '031562',
        fullName: 'John Alex',
        email: 'testing123@gmail.com',
        phone: '+96320584138940',
        role: ROLES.SUPER_ADMIN,
    },
];

const Table_Header = [
    { key: 'userId', label: 'User ID' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'role', label: 'Role' },
    { label: 'Action', key: 'action', },
];

export const RolesNPermissions: React.FC = () => {
    const { setTitle } = useHeaderProps();
    const [memberModal, setMemberModal] = useState(false);
    const [memberModalEditData, setMemberModalEditData] = useState<IUserModel | null>(null);
    const [params, setParams] = useState({
        limit: 10,
        page: 1,
        role: "non_user"
    });

    const { userData, isLoading, refetch } = useGetAllUserData(params);
    const { deleteSingleUser } = useDeleteSingleUser();
    const { changeRoleMutate } = useHandelChangeRole();

    useEffect(() => setTitle('Roles & Permissions'), []);


    const handleDeleteClick = (user: IUserModel) => {
        deleteSingleUser({ userId: user._id }, {
            onSuccess: () => {
                showSuccessMessage('User deleted successfully!');
                refetch();
            },
            onError: () => {
                showErrorMessage('An error occurred while deleting the user.');
            },

        });
    };

    const handleChangeRole = (userId: string, newRole: ChangeRoleParams) => {
        changeRoleMutate({ role: newRole, id: userId }, {
            onSuccess: () => {
                showSuccessMessage('User role changed successfully!');
                refetch();
            },
            onError: () => {
                showErrorMessage('An error occurred while changing the user role.');
            },

        });
    };

    const handleAddMemberModal = (data: IUserModel | null, type: string) => {
        setMemberModal(true);
        setMemberModalEditData(type === 'edit' ? data : null);
    };

    return (
        <section className="overflow-hidden my-10">
            <div className="flex justify-between items-center flex-wrap gap-6">
                <div>
                    <Button
                        variant='text'
                        onClick={() => handleAddMemberModal(null, 'add')}
                        className='border border-primary bg-primary text-white font-normal shadow-none h-11 px-5 gap-6 text-sm w-fit'>
                        <AddRoundedIcon className="fill-white text-white" />  Add New Member
                    </Button>
                </div>
            </div>
            {/* Custom Table */}
            <div className="text-xl bg-medium-gray text-white px-4 py-4 rounded-ss-lg rounded-se-lg mt-5">
                User Accounts <span className="text-border-gray text-sm ml-2">{tableData.length} Results</span>
            </div>
            {/* Scroll Wrapper */}
            <div className="w-full overflow-x-auto overflow-y-auto h-[800px] lg:max-h-[800px]">
                {isLoading ?
                    <div className='flex justify-center items-center h-32'>
                        <Spin size="large" />
                    </div>
                    :
                    <>
                        {userData?.length === 0 ?
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
                                                {header.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData?.map((user: IUserModel, index: number) => (
                                        <tr key={index} className="border-t hover:bg-gray-50">
                                            <Tooltip title={user?._id}>
                                                <td className="p-5  truncate max-w-[160px]">{user?._id}</td>
                                            </Tooltip>
                                            <td className="p-5">{user?.firstName} {user?.lastName}</td>
                                            <td className="p-5">{user?.email}</td>
                                            <td className="p-5">{user?.phoneNumber}</td>
                                            <RoleCell user={user} onChangeRole={handleChangeRole} />
                                            <td className="p-5 text-xl space-x-2">
                                                <Button variant="text" onClick={() => handleAddMemberModal(user, 'edit')} className="border-none shadow-none">
                                                    <EditIcon className="text-black" />
                                                </Button>
                                                <Popconfirm
                                                    title="Are you sure to delete this user?"
                                                    onConfirm={() => handleDeleteClick(user)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button className="border-none shadow-none"><DeleteIcon /></Button>
                                                </Popconfirm>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        }
                    </>
                }

            </div>
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
    onChangeRole: (userId: string, newRole: ChangeRoleParams) => void;
}

export const RoleCell: React.FC<Props> = ({ user, onChangeRole }) => {
    return (
        <td className="p-5">
            <Select
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
