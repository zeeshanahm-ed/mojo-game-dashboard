import React, { useEffect, useState } from "react";
import { useHeaderProps } from "components/core/use-header-props";
import { Input, Checkbox, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ArrowIcon from "assets/icons/arrow-icon.svg?react";
import UserDetailsModal from "./components/user-details-modal";

interface User {
  key: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  status: "Active" | "Suspended" | "Archived";
}

const staticData: User[] = [
  { key: "1", userId: "031556", fullName: "John Alex", email: "testing123@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "2", userId: "031556", fullName: "Alexander Brian", email: "testing123@gmail.com", phone: "+96320584138940", status: "Suspended" },
  { key: "3", userId: "031556", fullName: "Gustafosan Lee", email: "testing123@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "4", userId: "031556", fullName: "Ahmad Ali", email: "testing123@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "5", userId: "031556", fullName: "Sheikh Muhammad", email: "testing123@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "6", userId: "017518", fullName: "Abdur Rehman", email: "testing123@gmail.com", phone: "+96320584138940", status: "Archived" },
  { key: "7", userId: "015981", fullName: "Muhammad Bin Ali", email: "testing123@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "8", userId: "018318", fullName: "Brian Johnson", email: "testing123@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "9", userId: "031556", fullName: "Dawayeon Johnson", email: "testing123@yahoo.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
  { key: "10", userId: "031891", fullName: "Bilal Muhammad", email: "Bilalgamer@gmail.com", phone: "+96320584138940", status: "Active" },
];

const Table_Header = [
  "User ID",
  "Full Name",
  "Email Address",
  "Phone Number",
  "Status",
  "",
];

const statusColors: Record<User["status"], string> = {
  Active: "text-secondary",
  Suspended: "text-dark-gray",
  Archived: "text-dark-gray",
};

export const UserManagement: React.FC = () => {
  const { setTitle } = useHeaderProps();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);

  useEffect(() => setTitle('User Management'), [setTitle]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? "" : status));
  };

  const filteredData = staticData.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatus === "" || user.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleModalToggle = () => {
    setUserDetailsModalOpen(!userDetailsModalOpen);
  };

  return (
    <section className="overflow-hidden my-10">
      {/* Search and Filters */}
      <div className="flex flex-col gap-y-5">
        <Input
          placeholder="Search by name"
          prefix={<SearchOutlined />}
          variant={undefined}
          className="w-full rounded-none border-b border-border-gray"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="border border-border-gray p-5 rounded flex items-center gap-4 flex-wrap">
          <Checkbox
            checked={selectedStatus === ""}
            onChange={() => setSelectedStatus("")}
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
        <div className="w-full overflow-x-auto overflow-y-auto lg:max-h-[800px]">
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
              {filteredData.map((user) => (
                <tr key={user.key} className="border-t hover:bg-gray-50">
                  <td className="p-5">{user.userId}</td>
                  <td className="p-5">{user.fullName}</td>
                  <td className="p-5">{user.email}</td>
                  <td className="p-5">{user.phone}</td>
                  <td className={`p-5 ${statusColors[user.status]}`}>
                    {user.status}
                  </td>
                  <td className="p-5 text-xl cursor-pointer">
                    <Button onClick={handleModalToggle} className="border-none shadow-none">
                      <ArrowIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-4 text-gray-500">No users found.</div>
          )}
        </div>
      </div>
      <UserDetailsModal isOpen={userDetailsModalOpen} onClose={handleModalToggle} />
    </section>
  );
};

export default UserManagement;
