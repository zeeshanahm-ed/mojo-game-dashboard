import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { Input, Checkbox, Button, Spin, Empty, Tooltip } from "antd";
const UserDetailsModal = lazy(() => import("./components/user-details-modal"));
import FallbackLoader from "components/core-ui/fallback-loader/FallbackLoader";
//utils
import { useHeaderProps } from "components/core/use-header-props";
import useUserData from "./core/hooks/useUserData";
import { IUserModel } from "auth";
//icons
import { SearchOutlined } from "@ant-design/icons";
import ArrowIcon from "assets/icons/arrow-icon.svg?react";
import { debounce } from "helpers/CustomHelpers";

const Table_Header = [
  "User ID",
  "Full Name",
  "Email Address",
  "Phone Number",
  "Status",
  "",
];

const statusColors: Record<IUserModel["status"], string> = {
  Active: "text-secondary",
  Suspended: "text-dark-gray",
  Archived: "text-dark-gray",
};

export const UserManagement: React.FC = () => {
  const { setTitle } = useHeaderProps();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [modalData, setModalData] = useState<IUserModel>();
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [parems, setParems] = useState({
    limit: 10,
    page: 1,
    role: "user",
    status: "all"
  });

  const { userData, isLoading, refetch } = useUserData(parems);

  useEffect(() => setTitle('User Management'), [setTitle]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setParems(prev => ({ ...prev, status: status }))
  };

  const debouncedOnChange = useCallback(
    debounce((name: string) => {
      setParems((prev) => ({ ...prev, name }));
    }, 800),
    []
  );

  const handleModalToggle = (data: IUserModel) => {
    setUserDetailsModalOpen(true);
    setModalData(data)
  };

  const handleModalClose = () => {
    setUserDetailsModalOpen(false);
  };

  return (
    <section className="overflow-hidden my-10">
      {/* Search and Filters */}
      <div className="flex flex-col gap-y-5">
        <Input
          placeholder="Search by name"
          prefix={<SearchOutlined className="mr-5" />}
          variant="underlined"
          className="w-full"
          value={search}
          onChange={(e) => { setSearch(e.target.value); debouncedOnChange(e.target.value) }}
        />

        <div className="border border-border-gray p-5 rounded flex items-center gap-4 flex-wrap">
          <Checkbox
            checked={selectedStatus === "all"}
            onChange={() => setSelectedStatus("all")}
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
          Showing all Users <span className="text-border-gray text-sm ml-2">new users</span>
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
                          {header}
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
                        <td className="p-5">{user.firstName} {user.lastName}</td>
                        <td className="p-5">{user.email}</td>
                        <td className="p-5">{user.phoneNumber}</td>
                        <td className={`p-5 ${statusColors[user.status]}`}>
                          {user.status}
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
      <Suspense fallback={<FallbackLoader />}>
        {userDetailsModalOpen &&
          <UserDetailsModal
            isOpen={userDetailsModalOpen}
            onClose={handleModalClose}
            modalData={modalData}
            refetchAllUserData={refetch}
          />}
      </Suspense>
    </section>
  );
};

export default UserManagement;
