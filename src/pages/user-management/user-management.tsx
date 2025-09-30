import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { Input, Checkbox, Button, Spin, Empty, Tooltip, Pagination } from "antd";
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
import { useTranslation } from "react-i18next";
import { useDirection } from "hooks/useGetDirection";

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

const UserManagement: React.FC = () => {
  const { setTitle } = useHeaderProps();
  const direction = useDirection();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [modalData, setModalData] = useState<IUserModel>();
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    role: "user",
    status: "all"
  });

  const { userData, isLoading, refetch, pagination } = useUserData(params);

  useEffect(() => setTitle(t('User Management')), [setTitle, t]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setParams(prev => ({ ...prev, status: status }))
  };

  const debouncedOnChange = useCallback(
    debounce((name: string) => {
      setParams((prev) => ({ ...prev, page: 1, name }));
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
  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  return (
    <section className="overflow-hidden my-10">
      {/* Search and Filters */}
      <div className="flex flex-col gap-y-5">
        <Input
          placeholder={t('Search by name')}
          prefix={<SearchOutlined className="mr-5" />}
          variant="underlined"
          className="w-full"
          value={search}
          onChange={(e) => { setSearch(e.target.value); debouncedOnChange(e.target.value) }}
        />

        <div className="border border-border-gray p-5 rounded flex items-center gap-4 flex-wrap">
          <Checkbox
            checked={selectedStatus === "all"}
            onChange={() => handleStatusChange("all")}
          >
            {t('All Accounts')}
          </Checkbox>
          <Checkbox
            checked={selectedStatus === "Active"}
            onChange={() => handleStatusChange("Active")}
          >
            {t('Active')}
          </Checkbox>
          <Checkbox
            checked={selectedStatus === "Suspended"}
            onChange={() => handleStatusChange("Suspended")}
          >
            {t('Suspended')}
          </Checkbox>
        </div>
      </div>

      {/* Heading */}

      {/* Custom Table */}
      <div className="border border-gray-200  rounded-lg mt-5">
        <div className="text-xl bg-black text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
          {t('Showing all Users')} {pagination?.total && <span className="text-border-gray text-sm me-2">{pagination?.total} {t('Results')}</span>}
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
                    {userData?.map((user: IUserModel, index: number) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="p-5  truncate max-w-[160px]">
                          <Tooltip title={user?._id}>
                            {user?._id}
                          </Tooltip>
                        </td>
                        <td className="p-5">{user.firstName} {user.lastName}</td>
                        <td className="p-5">{user.email}</td>
                        <td className="p-5">{user.phoneNumber}</td>
                        <td className={`p-5 ${statusColors[user.status]}`}>
                          {t(user.status)}
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

      {userData?.length > 0 && <Pagination
        className="mt-5 justify-center text-white"
        current={params?.page}
        pageSize={pagination?.limit}
        total={pagination?.total || 0}
        onChange={handlePageChange}
      />}



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
