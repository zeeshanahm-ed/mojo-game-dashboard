import React, { useEffect } from "react";
import { useHeaderProps } from "components/core/use-header-props";
import { Button, Popconfirm, Select } from "antd";
import { ROLES } from "utils/Enums";
import { FiChevronDown } from "react-icons/fi";
import DeleteIcon from 'assets/icons/delete-icon.svg?react';

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
    { key: 'role', label: 'Permissions' },
    { label: 'Action', key: 'action', },
];

export const RolesNPermissions: React.FC = () => {
    const { setTitle } = useHeaderProps();

    useEffect(() => setTitle('Roles & Permissions'), []);


    const handleDeleteClick = () => {
    };

    const handleChangeRole = (userId: string, newRole: ROLES) => {
        console.log(`Change role for ${userId} to ${newRole}`);
    }

    return (
        <section className="overflow-hidden my-10">

            {/* Custom Table */}
            <div className="text-xl bg-medium-gray text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
                User Accounts <span className="text-border-gray text-sm ml-2">{tableData.length} Results</span>
            </div>
            <div className=" mt-5">
                {/* Scroll Wrapper */}
                <div className="w-full overflow-x-auto overflow-y-auto h-[800px] lg:max-h-[800px]">
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
                            {tableData.map((user) => (
                                <tr key={user.userId} className="border-t hover:bg-gray-50">
                                    <td className="p-5">{user.userId}</td>
                                    <td className="p-5">{user.fullName}</td>
                                    <td className="p-5">{user.email}</td>
                                    <td className="p-5">{user.phone}</td>
                                    <RoleCell user={user} onChangeRole={handleChangeRole} />
                                    <td className="p-5 text-xl cursor-pointer">
                                        <Popconfirm
                                            title="Are you sure to delete this user?"
                                            onConfirm={() => handleDeleteClick()}
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
                    {tableData.length === 0 && (
                        <div className="p-4 text-gray-500">No users found.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default RolesNPermissions;

interface Props {
    user: any;
    onChangeRole: (userId: string, newRole: ROLES) => void;
}

export const roleOptions = [
    { label: 'Super Admin', value: ROLES.SUPER_ADMIN },
    { label: 'Content Manager', value: ROLES.CONTENT_MANAGER },
    { label: 'Finance Manager', value: ROLES.FINANCE_MANAGER },
    { label: 'Read Only', value: ROLES.READ_ONLY },
];

export const RoleCell: React.FC<Props> = ({ user, onChangeRole }) => {
    return (
        <td className="p-5">
            <Select
                variant="borderless"
                value={user.role}
                className="w-48"
                suffixIcon={<FiChevronDown size={18} color="#000" />}
                options={roleOptions}
                onChange={(value) => onChangeRole(user.userId, value as ROLES)}
            />
        </td>
    );
};
